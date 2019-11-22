const mongoose = require("mongoose");

module.exports = {
    MinaChangSchema: mongoose.model('MinaChang', {
        text: {
            type: String,
            required: true
        }
    }),
    SpecialElectionSchema: mongoose.model('SpecialElection', {
        text: {
            type: String,
            require: true
        }
    }),
};