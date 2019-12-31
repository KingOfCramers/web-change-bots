const find = require("../mongodb/find");
const updateOne = require("../mongodb/updateOne");
const sendText = require("../texter");
const mongoose = require("mongoose");
const logger = require("../logger");

module.exports = async ({ page, browser, today, args }) => {
    logger.info(`Checking minaChang at ${today.format("llll")}`);
    
    try {
      let uri = "mongodb://localhost:27017/multi_paragraph?authSource=admin";
      let options =  { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true,  user: "admin", pass: process.env.MONGO_PASS };
      let db = await mongoose.connect(uri, options);
    } catch(err){
        return logger.error(`Could not connect to database. `, err);
    };

    try {
        await page.goto(args.link, { waitUntil: 'networkidle2' }); // Ensure no network requests are happening (in last 500ms).
    } catch (err) {
        return logger.error(`Could not navigate to minaChang page. `, err);
    };

    try {
        var text = await page.evaluate((args) => {
            let text = Array.from(document.querySelectorAll(args.query))
                .reduce((agg,x) => { 
                    agg = agg.concat(x.textContent); 
                    return agg; 
                }, '');

            return text

        }, args);
        logger.info("Page text defined.");  
        
    } catch(err){
        return logger.error(`Error parsing page text. `, err);
    }

    try {
        var dbData = await find(args.schema);
        var dbText = dbData[0].text;
        var isNew = dbText !== text;
    } catch(err) {
        logger.error(`Error comparing page text. `, err);
    };

    try {
        if(isNew){
            await updateOne(text, args.schema);
            logger.info(`Text updated successfully.`)
        }
    } catch (err) {
        logger.error(`Error uploading data. `, err);
    };

    try {
        if(isNew){
            console.log(dbData)
            let myMessage = await sendText({ title: 'New text', oldString: dbText, newString: text });
            logger.info(`${myMessage ? 'Message sent: '.concat(JSON.stringify(myMessage)) : 'Message not sent, running in development.'}`);
        };
    } catch(err){
        logger.error(`Error texting data. `, err);
    };
        
    try {
        await db.disconnect();
    } catch (err) {
        logger.error("Error disconnecting: ", err);
    }

};
