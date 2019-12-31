require('dotenv').config({ path: "../envs/change_checker.env" });

const cron = require("node-cron");
const moment = require("moment");
const logger = require("./logger");

// Import utility functions...
const { launchBots, setUpPuppeteer } = require("./setup"); 

// Import bots..
const multiParagraph = require("./bots/multiParagraph"); 
const newTagChecker = require("./bots/newTagChecker");

// Import schemas...
const { MinaChangSchema, SpecialElectionSchema } = require("./mongodb/schemas");

// Run program...
if(process.env.NODE_ENV === 'production'){
    logger.info(`Starting up bots in ${process.env.NODE_ENV} at ${moment().format("llll")}`);
    cron.schedule('*/15 * * * *', async () => {
        try {
            let { today, browser, page } = await setUpPuppeteer();
            logger.info(`Running 15-min programs at ${today.format("llll")}`);

            await launchBots({ page, browser, today, 
                bots: [
                    // { bot: multiParagraph, args: { query: "div.entry-content p", link: 'https://www.state.gov/biographies/mina-chang/', schema: MinaChangSchema } },
                    { bot: newTagChecker, args: { subject: 'New Special Election Dates', emails: [process.env.EMAIL, process.env.EMAIL2], schema: SpecialElectionSchema, link: 'https://www.fec.gov/help-candidates-and-committees/dates-and-deadlines/', getElementById: "2019-20-special-elections", querySelectorAll: "div.rich-text > ul > li" }}
                ]
            }); // Launch bots in production...

            await page.close();
            await browser.close();
            logger.info(`Chrome Closed Bots.`);
        } catch (err){
            logger.error('Root Error.', err);
        }                
    });
} else {
    (async () => {
        try {
            let { today, browser, page } = await setUpPuppeteer();
            logger.info(`Running program at ${today.format("llll")}`);

            // await multiParagraph({ today, browser, page, args: { query: 'div.entry-content p', link: 'https://www.state.gov/biographies/mina-chang/', schema: MINACHANG } });
            // await newTagChecker({ page, args: { subject: 'New Special Election Dates', emails: [process.env.EMAIL], schema: SpecialElectionSchema, link: 'https://www.fec.gov/help-candidates-and-committees/dates-and-deadlines/', getElementById: "2019-20-special-elections", querySelectorAll: "div.rich-text > ul > li" }});

            await page.close();
            await browser.close();
            logger.info(`Chrome Closed Bots.`);
        } catch (err){
            logger.error('Root Error in development. ', err);
        }
    })();
};
