const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let bannerSchema = new Schema({
    name: {    // 名称
        type: String
    },
    url: {    // 链接地址
        type: String
    },
    img: {     // 图片
        type: String
    },
    stime: {   // 上架时间
        type: String,
        required: true,
    },
    type: {    // 轮播图位置 默认为首页轮播图
        type: String,
        default: 'home'
    },
    etime: {   // 下架时间
        type: String,
        required: true
    },
    mtime: {    // 修改时间
        type: String,
        default: Date.now()
    },
    ctime: {    // 创建时间
        type: String,
        default: Date.now()
    },
})

let bannerModel = mongoose.model('banner', bannerSchema);


module.exports = bannerModel;