/**
 * @Author QJ
 * @date 2019--17 11:59
 * @desc permission.js
 */
module.exports = (req, res, next) => {
    if(!(req.url.includes('/get') || req.url.includes('/search'))) {
        const token = req.session.token;
        if(!token) {
            res.send({
                error_code: 0,
                result: '未登录'
            });
            return null;
        }
    }

    next();
};
