const ErrorLog = require('../models/errorModdel');

module.exports = (err, req, res, next) => {
    console.log('进入了错误处理');
    console.log(err);
    if(err) {
        let error = new ErrorLog({
            error_name: err.name,
            error_url: req.url,
            error_message: err.message,
            error_stack: err.stack
        });

        error.save(() => {
            res.send({
                error_code: 500,
                data: "服务器内部错误"
            });
        })
    }
};
