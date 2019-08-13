let mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    user_name: {    // 用户名
        type: String,
        required: true
    },
    user_pwd: {    // 密码
        type: String,
        required: false
    },
    real_name: {   // 真实姓名
        type: String
    },
    email: {     // 邮箱
      type: String,
    },
    salt: {     // 盐
      type: String
    },
    phone: {     // 电话
      type: String
    },
    head_img: {       // 头像
      type: String
    },
    desc: {    // 描述
        type: String,
        required: false
    },
    level: {       // 等级
        type: Number,
        default: 0
    },
    gold: {       // 金币
        type: Number,
        default: 0
    },
    grade: {     // 积分
        type: Number,
        default: 100
    },
    super: {     // 用户类型 0 普通用户 9 超级管理员
        type: Number,
        default: 0
    },
    ctime: {
        type: String,
        default: Date.now() + 1000 * 60 * 8
    },
    mtime: {
        type: String,
        default: Date.now() + 1000 * 60 * 8
    }

});


const userModel = mongoose.model('user', userSchema);

module.exports = userModel;


