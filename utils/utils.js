/**
 * @Author QJ
 * @date 2019--13 18:25
 * @desc utils.js
 */
let crypto = require('crypto');
const fs = require('fs');
const path = require('path');


/**
 * 密码加密
 * @param {String} string
 * @returns {{password: string, salt: string}}
 */
function md5 (string) {
    const hash = crypto.createHash('md5');
    const salt = getSalt();
    hash.update(string + salt);
    const password = hash.digest('hex');

    return {
        password,
        salt
    }
}

/**
 * 校验密码
 * @param {String} string
 * @param {String} salt
 * @param {String} password
 * @returns {boolean}
 */
function checkPassword (string, salt, password) {
    const hash = crypto.createHash('md5');
    hash.update(string + salt);
    return  hash.digest('hex') === password;
}


/**
 * 获取盐
 * @param {Number} len
 * @returns {string|string}
 */
function getSalt(len = 5) {
    let salt = '';
    const characters = ['@', '#', '&', '^', '?', '+', '$', ',', 'A', 'M', 'S', 'W', 'E', 'U', 'O', 'P', 'H', 'J', 'K', 'L', 'Z', 'V'];
    for(let i=0; i<len; i++) {
        let index = Math.floor(Math.random() * characters.length);
        salt += characters[index];
    }
    return salt;
}

/**
 * 获取随机验证码
 * @param {Number} len
 * @param {string} type 'num' | 'letter' | others
 * @returns {string|string}
 */
function getRandomCode(len = 6, type='num') {
    let numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let code = '';

    let tempArr = null;
    if(type === 'num') {
        tempArr = numArr;
    }else if(type === 'letter') {
        tempArr = letterArr;
    }else {
        tempArr = [...numArr, ...letterArr];
    }
    for(let i=0; i<len; i++) {
        let index = Math.floor(Math.random() * tempArr.length);
        code += tempArr[index];
    }

    return code;

}

/**
 * 格式化日期时间
 * @param fmt
 * @param date
 * @returns {*}
 */
function formatDate(fmt, date = new Date()) {
    let o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(let k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 获取上传目录
 * @returns {string}
 */
function getUploadDir() {
    let todayDir = formatDate('yyyyMMdd');
    let dir = path.join(__dirname, '../upload', todayDir);
    fs.existsSync(dir) || fs.mkdirSync(dir);

    return dir;
}

function createImgName(ext) {
    return formatDate('yyyyMMddhhmmss') + getRandomCode(6, 'mixed') + ext;
}

/**
 * 检测手机号
 * @param phone
 * @returns {boolean}
 */
function checkPhone(phone) {
    const reg = /^1[356789][\d]{9}$/g;
    return reg.test(phone);
}

/**
 * 获取token中的用户id
 * @param req
 * @returns {*}
 */
function getIdBySession(req) {
    if(!req) return null;
    const userInfo = req.session.token && JSON.parse(req.session.token);
    return userInfo._id || null;
}

module.exports = {
    md5,
    getSalt,
    getRandomCode,
    checkPassword,
    getUploadDir,
    createImgName,
    formatDate,
    checkPhone,
    getIdBySession
};
