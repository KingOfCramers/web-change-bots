const twilio = require('twilio')
const logger = require("../logger");

module.exports = async ({ title, oldString, newString }) => {
    try {

        let body = `${title}:\n\n ${oldString.substring(0, 750)}\n –––––> \n${newString.substring(0,750)}`;
        logger.info(`Changed: ${oldString} ––> ${newString}`);

        // Deal w/ extra long messages over 1600 words....

        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        let message = process.env.NODE_ENV === 'production' ? await client.messages.create({
            body,
            from: process.env.TWILIO_FROM,
            to: process.env.TWILIO_TO
       }) : false;

       return message;

    } catch (err) {
        logger.error('Error processing text ', err);
    }
};

