/**
 * @Author QJ
 * @date 2019--13 11:59
 * @desc cart.js
 */
const express = require('express');
const utils = require('../utils/utils');
const Cart = require('../models/cart');
const mongoose = require('mongoose');

const router = express.Router();
/**
 * 新增购物车数据
 * body {
 *   goods_id {string} 商品id
 * }
 */
router.post('/api/create', (req, res, next) => {
  const { goods_id } = req.body;
  const user_id = utils.getIdBySession(req);
  // 查询这个产品是否存在
  Cart.find({user_id, goods_id, del: 0}, (err, result) => {
    if(err) {
      return next(err);
    }
    console.log('result', result);
    if(result.length > 0) {
      // 购物车中物品已经存在
      result[0].num += 1;
      result[0].save((err) => {
        if(err) {
          return next(Error(err));
        }
        res.send({
          error_code: 0,
          message: '新增成功'
        })
      })
    }else {
      // 购物车中没有该物品
      const cart = new Cart({
        goods_id,
        num: 1,
        user_id,
      });

      cart.save((err, result) => {
        if(err) {
          return next(Error(err));
        }
        res.send({
          error_code: 0,
          data: result,
          message: '新增成功'
        })
      })
    }
  });
});

/**
 * 查询购物车
 * 参数： 无
 */
router.get('/api/search/', (req, res) => {
  const user_id = utils.getIdBySession(req);

  Cart.aggregate([
    {
      $lookup: {
        from: 'goods',
        localField: 'goods_id',
        foreignField: 'goods_id',
        as: 'GOODS'
      }
    },
    {
      $match: {
        user_id: mongoose.Types.ObjectId(user_id)
      }
    }
  ], (err, result) => {
    if(err) {
      return next(Error(err));
    }
    /*const map = new Map();
    result.forEach((item) => {
      if(map.has(item.goods_id)) {
        const data = JSON.parse(JSON.stringify(map.get(item.goods_id)));
        const num = item.num;
        data.num += num;
        map.set(item.goods_id, data);

      }else {
        map.set(item.goods_id, item);
      }
    });*/
    res.json({
      error_code: 0,
      data: result
    })
  })


});

/**
 * 修改购物车数量
 * params {string} goods_id 商品id
 * body {
 *   type: 'add' / *  添加 / 减少
 * }
 */
router.post('/api/num/:goods_id', (req, res, next) => {
  let { type } = req.body;
  const goods_id = req.params.goods_id;
  const user_id = utils.getIdBySession(req);

  Cart.findOne({goods_id, del: 0, user_id}, (err, result) => {
    if(err) return next(Error(err));
    if(result) {
      let currentNum = parseInt(result.num);
      currentNum += type === 'add' ?  1 : -1;
      if(currentNum === 0) {
        // 删除数据
        result.remove((err, result) => {
          if(err) return next(Error(err));
          res.send({
            error_code: 0,
            message: '该商品已删除'
          })
        })
      }else {
        result.num = currentNum;
        result.save((err, result) => {
          if(err) return next(Error(err));
          res.send({
            error_code: 0,
            message: '修改成功'
          })
        })
      }


    }else {
      res.send({
        error_code: 1,
        message: '未查询购物车中该商品'
      })
    }
  })
});

/**
 * 删除所有购物车
 * 参数 无
 */

router.get('/api/clear', (req, res, next) => {
  const user_id = utils.getIdBySession(req);
  Cart.deleteMany({user_id}, (err, result) => {
    if(err) return next(Error(err));
    console.log(result);
    res.send({
      error_code: 0,
      message: '购物车已清空'
    })
  })
});


module.exports = router;

