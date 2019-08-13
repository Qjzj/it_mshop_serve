/**
 * @Author QJ
 * @date 2019--17 10:27
 * @desc db.js
 */
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/itlike', {useNewUrlParser: true, useFindAndModify: false});

let db = mongoose.connection;

db.on('open', (err) => {
    if(!err) {
        console.log('数据库已连接')
    }
});

db.on('close', (err) => {
    if(!err) {
        console.log('数据库已经关闭');
    }
});

module.exports = db;
