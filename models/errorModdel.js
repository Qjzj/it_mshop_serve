const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const errorSchema = new Schema({
    error_name: {
        type: String
    },
    error_message: {
        type: String
    },
    error_stack: {
        type: String
    },
    error_url: {
        type: String,
    },
    error_time: {
        type: Date,
        default: new Date()
    }
});

const error_logs = mongoose.model('error_log', errorSchema);

module.exports = error_logs;
