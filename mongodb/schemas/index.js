const mongoose = require("mongoose");

module.exports = {
    MINACHANG: mongoose.model('MinaChang', {
        text: {
            type: String,
            required: true
        }
    })
};