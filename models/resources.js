/**
 * @Author QJ
 * @date 2019--17 10:04
 * @desc resources.js
 */
let mongoose = require('mongoose');


const resourceShema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    cover_img: {
        type: String,
        required: true
    },
    read_count: {
        type: Number,
        default: 1
    },
    collection_count: {
        type: Number,
        default: 0
    },
    ctime: {
        type: String,
        default: Date.now() + 8 * 60 * 1000
    },
    mtime: {
        type: String,
        default: Date.now() + 8 * 60 * 1000
    }
});

const resourceModel = mongoose.model('resource', resourceShema);

module.exports = resourceModel;
