const express = require('express');
const router = express.Router();
const User = require('../models/users');
const utils = require('../utils/utils');
const formidable = require('formidable');
const path = require('path');



// 注册用户
router.post('/api/create', (req, res, next) => {
  const body = req.body;
  const passwordInfo = utils.md5(body.user_pwd);

  let user_name = body.user_name;

  User.find({user_name}, (err, result) => {
    if(!err) {
      if(result.length > 0) {
        res.send({
          error_code: 1,
          result: '该用户已存在'
        })
      }else {
        const user = new User({
          user_name: body.user_name,
          user_pwd: passwordInfo.password,
          salt: passwordInfo.salt,
          ctime: Date.now()
        });

        user.save((err, result) => {
          if(!err) {
            res.send({
              error_code: 0,
              result: result._id
            });
          }
        })
      }
    }
  })
});
// 获取手机验证码
router.post('/api/getPhoneCode', (req, res, next) => {
  console.log(req.body);
  const phone = req.body.phone;
  if(!phone) {
    res.send({
      error_code: 1,
      data: null,
      message: '请输入手机号'
    })
  }else if(utils.checkPhone(phone)) {
    const code = utils.getRandomCode();
    req.session.code = code;
    // TODO 发送验证码
    res.send({
      error_code: 0,
      data: {
        code
      },
      message: null
    })
  }else {
    res.send({
      error_code: 1,
      message: '请输入正确的手机号'
    })
  }

});
// 手机验证码登录
router.post('/api/phoneLogin', (req, res, next) => {
  const {phone, code} = req.body;
  if(!utils.checkPhone(phone)) {
    res.send({
      error_code: 1,
      message: '请输入正确的手机号'
    })
  }
  if(!code) {
    res.send({
      error_code: 1,
      message: '请输入手机验证码'
    })
  }

  console.log(req.session);
  if(req.session.code !== code) {
    res.send({
      error_code: 1,
      message: '验证码输入有误'
    })
  }else {
    User.findOne({phone: phone}, (err, user) => {
      if(!err) {
        console.log(user);
        if(user) {
          // 有这个用户
          console.log(user);
          req.session.token = JSON.stringify(user);
          res.send({
            error_code: 0,
            data: user,
            message: '登录成功'
          })
        }else {
          console.log('没有这个用户');
          // 没有该用户，新增用户
          const user = new User({
            phone: phone,
            user_name: '用户' + Date.now()
          });
          user.save((err, result) => {

            if(!err) {
              req.session.token = JSON.stringify(result);
              res.send({
                error_code: 0,
                data: result,
                message: '登录成功'
              })
            }else {
              console.log(err);
              return next(Error(err));
            }
          })

        }
      }else {
        console.log(err);
      }
    });
  }





});
// 密码登录
router.post('/api/login', (req, res, next) => {
  const body = req.body;

  User.findOne({user_name: body.user_name}, (err, result) => {
    if(err) {console.log(err);return err;}
    if(result) {
      // 校验密码
      let flag = utils.checkPassword(body.user_pwd, result['salt'], result['user_pwd']);
      if(flag) {
        req.session.token = JSON.stringify(result);
        res.send({
          error_code: 0,
          data: result,
          message: '登录成功'
        })
      }else {
        res.send({
          error_code: 1,
          result: '密码错误'
        })
      }
    }else {
      // 创建用户
      const passwordInfo = utils.md5(req.body.user_pwd);
      const user = new User({
        user_name: body.user_name,
        user_pwd: passwordInfo.password,
        salt: passwordInfo.salt,
        ctime: Date.now()
      });

      user.save((err, result) => {
        if(!err) {
          req.session.token = JSON.stringify(result);
          res.send({
            error_code: 0,
            data: result,
            message: '登录成功'
          })
        }
      })
    }

  })



});
// 退出登录
router.get('/api/logout', (req, res, next) => {
  req.session.destroy();
  res.send({
    error_code: 0,
    result: '退出登录成功'
  })
});
// 修改用户信息
router.post('/api/update/:id', (req, res, next) => {
  let id = req.params.id;

  const form = formidable.IncomingForm();
  form.uploadDir = utils.getUploadDir();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {

    let body = fields;
    if(!err) {
      if(files['head_img']) {
        let basename = path.basename(files['head_img'].path);
        body.head_img = '/' + utils.formatDate('yyyyMMdd') + '/' + basename;
      }
      //  有用户名修改
      if(fields['user_name']) {
        User.find({user_name: fields['user_name']}, "_id", (err, result) => {
          if(!err) {
            if(result.length > 1) {
              res.send({
                error_code: 1,
                result: '用户名已存在'
              });
            }else if(result.length === 1) {
              if(result[0]._id !== id) {
                res.send({
                  error_code: 1,
                  result: '用户名已存在'
                });
              }
            }else {
              User.findById(id, (err, findResult) => {

                if(!err) {
                  User.updateOne({id}, {
                    real_name: body.real_name ? body.real_name : findResult.real_name,
                    user_name: body.user_name ? body.user_name : findResult.user_name,
                    head_img: body.head_img ? body.head_img : findResult.head_img,
                    desc: body.desc ? body.desc : findResult.desc,
                    email: body.email ? body.email : findResult.email,
                    phone: body.phone ? body.phone : findResult.phone,
                    mtime: Date.now()
                  }, (err) => {
                    if(!err) {
                      res.send({
                        error_code: 0,
                        result: '修改成功'
                      });
                    }
                  })
                }
              });
            }
          }
        })
      }else {
        // 不修改用户名
        User.findById(id, (err, findResult) => {

          if(!err) {
            User.updateOne({id}, {
              real_name: body.real_name ? body.real_name : findResult.real_name,
              user_name: body.user_name ? body.user_name : findResult.user_name,
              head_img: body.head_img ? body.head_img : findResult.head_img,
              desc: body.desc ? body.desc : findResult.desc,
              email: body.email ? body.email : findResult.email,
              phone: body.phone ? body.phone : findResult.phone,
              mtime: Date.now()
            }, (err) => {
              if(!err) {
                res.send({
                  error_code: 0,
                  result: '修改成功'
                });
              }
            })
          }
        });
      }


    }
  })
});
// 获取单个用户
router.get('/api/get/:id', (req, res, next) => {
  let id = req.params.id;
  User.findById(id,'-user_pwd -salt -super', (err, result) => {
    if(!err) {
      res.send({
        error_code: 0,
        result
      })
    }else {
      res.send({
        error_code: 1,
        result: '数据库错误'
      })
    }
  })
});

module.exports = router;
