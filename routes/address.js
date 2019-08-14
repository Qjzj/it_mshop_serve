/**
 * @Author QJ
 * @date 2019--14 11:39
 * @desc address.js
 */
const express = require('express');
const Address = require('../models/address');
const utils = require('../utils/utils');

const router = express.Router();

/**
 * 新增地址
 * body {
 *   name: {string} 姓名
 *   phone {string} 电话
 *   address {string} 详细地址
 * }
 */
router.post('/api/create', (req, res, next) => {
  const user_id = utils.getIdBySession(req);
  const {
    name,
    phone,
    address
  } = req.body;

  const sAddress = new Address({
    name,
    phone,
    address,
    user_id
  });
  sAddress.save((err, result) => {
    if(err) return next(Error(err));
    res.send({
      error_code: 0,
      message: '添加地址成功'
    })
  })
});

/**
 * 修改地址
 * params {string} id
 * body {
 *   name: {string} 姓名
 *   phone: {string} 手机号
 *   address: {string} 详细地址
 * }
 */
router.post('/api/update/:id', (req, res, next) => {
  const id = req.params.id;
  const user_id = utils.getIdBySession(req);
  const { name, phone, address } = req.body;

  Address.findOne({_id: id, user_id}, (err, result) => {
    if(err) return next(Error(err));
    if(result) {
      if(name) result['name'] = name;
      if(phone) result['phone'] = phone;
      if(address) result['address'] = address;
      result.save((err, result) => {
        if(err) return next(Error(err));
        res.send({
          error_code: 0,
          message: '地址修改成功'
        })
      })
    }else {
      res.send({
        error_code: 0,
        message: '地址不存在或已经被删除'
      })
    }
  })
});

/**
 * 单个地址
 */
router.get('/api/get/:id', (req, res, next) => {
  const id = req.params.id;
  Address.findOne({_id: id}, (err, result) => {
    if(err) return next(Error(err));
    res.send({
      error_code: 0,
      data: result
    })
  })
});

/**
 * 获取所有地址
 */
router.get('/api/search', (req, res, next) => {
  const user_id = utils.getIdBySession(req);

  Address.find({user_id}, (err, result) => {
    if(err) return next(Error(err));
    res.send({
      error_code: 0,
      data: result
    })
  })
});






module.exports = router;
