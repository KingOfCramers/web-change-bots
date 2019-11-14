const getData = require("../mongodb/getData");
const uploadNewData = require("../mongodb/uploadNewData");
const sendText = require("../texter");
const mongoose = require("mongoose");
const logger = require("../logger");

module.exports = async ({ page, browser, today, args }) => {
    logger.info(`Checking minaChang at ${today.format("llll")}`);

    try {
        var db = await mongoose.connect('mongodb://localhost:27017/resources', { useNewUrlParser: true, useUnifiedTopology: true });
        logger.info("Database connected.");
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
        var dbData = await getData(args.schema);
        var dbText = dbData[0].text;
        var isNew = dbText !== text;
    } catch(err) {
        logger.error(`Error comparing page text. `, err);
    };

    try {
        if(isNew){
            await uploadNewData(text, args.schema);
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