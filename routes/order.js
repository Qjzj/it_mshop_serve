/**
 * @Author QJ
 * @date 2019--14 12:30
 * @desc order.js
 */
const express = require('express');
const Order = require('../models/order');
const utils = require('../utils/utils');
const mongoose = require('mongoose');

const router = express.Router();
/**
 * 新增订单
 * body {
 *   goods_id,  商品id
 *   price,     价格
 *   num,       数量
 *   address_id 地址id
 * }
 */
router.post('/api/create', (req, res, next) => {
  const user_id = utils.getIdBySession(req);
  const {
    goods_id,
    price,
    num,
    address_id
  } = req.body;

  const order = new Order({
    goods_id,
    price,
    num,
    address_id,
    user_id,
    all_price: num * price,
    ctime: Date.now()
  });

  order.save((err, result) => {
    if(err) return next(Error(err));

    res.send({
      error_code: 0,
      data: result,
      message: '创建订单成功'
    })
  })


});

/**
 * 订单支付
 * params {string} id
 */
router.post('/api/pay/:id', (req, res, next) => {
  const id = req.params.id;
  const user_id = utils.getIdBySession(req);

  Order.findOne({_id: id, user_id, del: 0}, (err, result) => {
    if(result) {
      const currentStatus = result[0].status;
      if(currentStatus === '0') {
        result.status = '1';
        result.save((err, result) => {
          if(err) return next(Error(err));
          res.send({
            error_code: 0,
            data: result
          })
        })
      }else {
        res.send({
          error_code: 1,
          message: '当前订单已经付款/已取消'
        })
      }
    }else {
      res.send({
        error_code: 1,
        message: '订单不存在/已被删除'
      })
    }
  });

});
/**
 * 取消订单
 * params {string} id
 */
router.post('/api/cancel/:id', (req, res, next) => {
  const id = req.params.id;
  const user_id = utils.getIdBySession(req);

  Order.findOne({_id: id, user_id, del: 0}, (err, result) => {
    if(result) {
      const currentStatus = result.status;
      if(currentStatus === '0') {
        result.status = '5';
        result.save((err, result) => {
          if(err) return next(Error(err));
          res.send({
            error_code: 0,
            data: result
          })
        })
      }else {
        res.send({
          error_code: 1,
          message: '当前订单已经付款/已取消'
        })
      }
    }else {
      res.send({
        error_code: 1,
        message: '订单不存在/已被删除'
      })
    }
  });
});
/**
 * 获取单个订单
 * params {string} id
 */
router.get('/api/get/:id', (req, res, next) => {
  const id = req.params.id;
  const user_id = utils.getIdBySession(req);

  Order.aggregate([
    {
      $lookup: {
        from: 'goods',
        localField: 'goods_id',
        foreignField: 'goods_id',
        as: 'GOODS'
      }
    },
    {
      $lookup: {
        from: 'addresses',
        localField: 'address_id',
        foreignField: '_id',
        as: 'ADDRESS'
      }
    },
    {
      $project: {
        user_id: 0,
        _v: 0,

      }
    },
    {
      $match: {
        _id: mongoose.Types.ObjectId(id),
        user_id: mongoose.Types.ObjectId(user_id),
        del: 0
      }
    }
  ], (err, result) => {
    if(err) return next(Error(err));
    if(result.length > 0) {
      res.send({
        error_code: 0,
        data: result[0]
      })
    }else {
      res.send({
        error_code: 1,
        message: '订单不存在/已被删除'
      })
    }
  });

});
/**
 * 查询所有订单
 */
router.get('/api/search', (req, res, next) => {
  const user_id = utils.getIdBySession(req);

  Order.aggregate([
    {
      $lookup: {
        from: 'goods',
        localField: 'goods_id',
        foreignField: 'goods_id',
        as: 'GOODS'
      }
    },
    {
      $lookup: {
        from: 'addresses',
        localField: 'address_id',
        foreignField: '_id',
        as: 'ADDRESS'
      }
    },
    {
      $match: {
        user_id: mongoose.Types.ObjectId(user_id),
        del: 0
      }
    }
  ], (err, result) => {
    if(err) return next(Error(err));
    res.send({
      error_code: 0,
      data: result
    })
  })
});
/**
 * 删除单个订单
 * params {string} id
 */
router.post('/api/del/:id', (req, res, next) => {
  const id = req.params.id;
  const user_id = utils.getIdBySession(req);

  Order.findById(id, (err, result) => {
    if(err) return  next(Error(err));
    // 判断订单是否是自己的
    if(result['user_id'].toString() !== user_id) {
      res.send({
        error_code: 1,
        message: '没有操作权限'
      });
    }else if(result['status'] === '5' || result['status'] === '1') {
      // 判断订单状态 只有已完成和已取消的订单能够删除
      result['del'] = 1;
      result.save((err, result) => {
        if(err) return next(Error(err));
        res.send({
          error_code: 0,
          data: result,
          message: '订单已删除'
        });
      })
    }else {
      res.send({
        error_code: 1,
        message: '订单无法删除'
      })
    }
  })


});



module.exports = router;
