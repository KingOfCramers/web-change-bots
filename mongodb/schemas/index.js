const mongoose = require("mongoose");

module.exports = {
    MINACHANG: mongoose.model('MinaChang', {
        text: {
            type: String,
            required: true
        }
    }),
    HFACSchema: mongoose.model('HFAC', {
        recordListTitle: {
            type: String,
            require: true
        },
        recordListTime: {
            type: String,
            require: true
        },
        recordListDate: {
            type: String,
            require: true
        },
        link: {
            type: String,
            require: true
        },
        witnesses: {
            type: Array,
            require: true
        }
    }),
    HASCSchema: mongoose.model('HASC', {
        recordListTitle: {
            type: String,
            require: true
        },
        recordListTime: {
            type: String,
            require: true
        },
        recordListDate: {
            type: String,
            require: true
        },
        link: {
            type: String,
            require: true
        },
        witnesses: {
            type: Array,
            require: true
        }
    }),
    SASCSchema: mongoose.model('SASC', {
        link: {
            type: String,
            require: true
        },
        date: {
            type: String,
            require: true
        },
        title: {
            type: String,
            require: true
        },
        location: {
            type: String,
            require: true
        },        
        witnesses: {
            type: Array,
            require: true
        }
    }),
    SVACSchema: mongoose.model('SVAC', {
        link: {
            type: String,
            require: true
        },
        date: {
            type: String,
            require: true
        },
        title: {
            type: String,
            require: true
        },
        location: {
            type: String,
            require: true
        },        
        witnesses: {
            type: Array,
            require: true
        }
    }),
    HVACSchema: mongoose.model('HVAC', {
        link: {
            type: String,
            require: true
        },
        date: {
            type: String,
            require: true
        },
        title: {
            type: String,
            require: true
        },
        location: {
            type: String,
            require: true
        },        
        witnesses: {
            type: Array,
            require: true
        }
    }),
    SFRCSchema: mongoose.model('SFRC', {
        link: {
            type: String,
            require: true
        },
        date: {
            type: String,
            require: true
        },
        title: {
            type: String,
            require: true
        },
        location: {
            type: String,
            require: true
        },
        witnesses: {
            type: Array,
            require: true
        }
    })
};