require('dotenv').config({ path: "../envs/change_checker.env" });

const cron = require("node-cron");
const moment = require("moment");
const logger = require("./logger");

// Import utility functions...
const { launchBots, setUpPuppeteer } = require("./setup"); 

// Import bots..
const multiParagraph = require("./bots/multiParagraph"); 

// Import schemas...
const { MINACHANG } = require("./mongodb/schemas");

// Run program...
if(process.env.NODE_ENV === 'production'){
    logger.info(`Starting up bots in ${process.env.NODE_ENV} at ${moment().format("llll")}`);
    cron.schedule('*/15 * * * *', async () => {
        try {
            let { today, browser, page } = await setUpPuppeteer();
            logger.info(`Running program at ${today.format("llll")}`);

            await launchBots({ page, browser, today, 
                bots: [
                    { bot: multiParagraph, args: { query: "div.entry-content p", link: 'https://www.state.gov/biographies/mina-chang/', schema: MINACHANG } }
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

            await multiParagraph({ today, browser, page, args: { query: 'div.entry-content p', link: 'https://www.state.gov/biographies/mina-chang/', schema: MINACHANG } });
             
            await page.close();
            await browser.close();
            logger.info(`Chrome Closed Bots.`);
        } catch (err){
            logger.error('Root Error in development. ', err);
        }
    })();
};