const find = require("../mongodb/find");
const mailer = require("../mailer");
const logger = require("../logger");
const mongoose = require("mongoose");
const insertMany = require("../mongodb/insertMany");

module.exports = async ({ page, emails, args }) => {

    try {
        var db = await mongoose.connect("mongodb://localhost:27017/resources", { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err){
        return logger.error(`Could not connect to database. `, err);
    };

    try {
        await page.goto(args.link, { waitUntil: 'networkidle2' });
    } catch(err) {
        return logger.error(`Could not navigate to page. `, err);
    }

    try {
        var dbData = await find(args.schema);
    } catch (err){
        return logger.error(`Could not fetch database data`, err);
    };
    
    try {
        var values = await page.evaluate(({ args }) => {
            if(args.getElementById){
                return Array.from(document.getElementById(args.getElementById).querySelectorAll(args.querySelectorAll))
                .map((i => i.firstChild.textContent));
            }
            return Array.from(document.getElementById(args.querySelectorAll))
                .map((i => i.firstChild.textContent));
        }, { args });
    } catch (err){
        logger.error("Error processing newest data", err);
    };

    try {
        var newData = values.filter(val => dbData.every(y => y.text !== val)).map(x => ({ text: x }));
        if(newData.length > 0){
            await insertMany(newData, args.schema);
            logger.info(`${newData.length} records uploaded successfully.`)
        }
    } catch (err){
        return logger.error(`Could not update database`, err);
    }

    try {
        if(newData.length > 0){
            let sent = await mailer({ emails: args.emails, subject: args.subject, text: { link: args.link, new: newData.map(x => x.text) }, mailDuringDevelopment: true });
            logger.info("Email sent! ", JSON.stringify(sent));
        };
    } catch(err){
        logger.error("Could not mail emails ", err);
    };

    try {
        await db.disconnect();
    } catch (err) {
        logger.info("Error disconnecting: ", err);
    };      
};