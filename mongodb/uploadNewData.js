const logger = require("../logger");

module.exports = async (newData, Model) => {
    try {
        await Model.updateOne({}, { text: newData });
    } catch(err) {
        logger.error(err);
    }
};