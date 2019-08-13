/**
 * @Author QJ
 * @date 2019--13 14:47
 * @desc goods.js
 */
const express = require('express');
const Goods = require('../models/goods');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/api/create', (req, res, next) => {
  const { goods_name, origin_price, price, small_image } = req.body;

  const goods = new Goods({
    goods_id: mongoose.Types.ObjectId(),
    goods_name: goods_name,
    origin_price: origin_price,
    price: price,
    small_image: small_image
  });
  goods.save((err, goods) => {
    if(err) {
      console.log(err);
    }
    res.send({
      error_code: 0,
      data: goods
    })
  })

});

router.get('/api/get/:id', (req, res, next) => {
  const id = req.params.id;
  Goods.find({goods_id: id, del: 0}, (err, result) => {
    if(err) {
      console.log(err);
    }
    res.send({
      error_code: 0,
      data: result
    })
  })
});
// 获取产品列表
router.get('/api/search', (req, res, next) => {
  Goods.find({del: 0}, (err, result) => {
    if(err) {
      console.log(err);
      return next(err);
    }
    res.send({
      error_code: 0,
      data: result,
    })
  })
});

module.exports = router;


