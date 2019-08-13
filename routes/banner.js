const express = require('express');
const Banner = require('../models/bannerModel');
const formidable = require('formidable');
const fs = require('fs');
const utils = require('../utils/utils');
const router = express.Router();





/**
 * 创建轮播图
 */
router.post('/api/create', (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = utils.getUploadDir();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if(err) return next(err);
    // 修改文件名称
    let ext = path.extname(files.img.name);
    let name = utils.formatDate('yyyyMMddhhmmss', new Date()) + Math.random().toString().substr(2, 4);
    name += ext;
    let oldPath = files.img.path;
    let newPath = path.join(utils.getUploadDir(), name);
    console.log(newPath);
    fs.rename(oldPath, newPath, (err) => {
      if(err) return next(err);

      let banner = new Banner({
        name: fields.name,
        url: fields.url,
        img: name,
        type: 'res',
        stime: fields.stime,
        etime: fields.etime
      });

      banner.save((err, result) => {
        if(err) {
          return next(err);
        }
        res.send({
          error_code: 0,
          message: '创建轮播图成功',
          data: result._id
        })
      })

    })
    // console.log(fields);
    // console.log(files);
  })

  /*let */
});

/**
 * 修改轮播图
 */
router.post('/api/update/:id', (req, res, next) => {
  let id =  req.params.id;
  let body = req.body;
  Banner.findByIdAndUpdate(id,
    {
      name: body.name,
      url: body.url,
      img: body.url,
      etime: body.etime,
      stime: body.stime,
      mtime: new Date()
    }, (err, result) => {
      if(err) return next(err);
      console.log(result);
      res.send({
        error_code: 0,
        data: '修改成功'
      })
    })
})

/**
 * 查询所有轮播图
 */
router.get('/api/search', (req, res, next) => {
  Banner.find({}, '_id name url img stime etime', (err, result) => {
    if(err) {
      return next(err);
    }

    res.send({
      error_code: 0,
      data: result
    })
  })
});

/**
 * 根据id查询单个轮播图
 */
router.get('/api/get/:id', (req, res, next) => {
  let id = req.params.id;
  Banner.findById(id, '_id name url img stime etime', (err, result) => {
    if(err) {
      return next(err);
    }
    res.send({
      error_code: 0,
      data: result
    })
  })
});

/**
 * 根据id删除轮播图
 */

router.get('/api/delete/:id', (req, res, next) => {
  let id = req.params.id;
  Banner.findByIdAndDelete(id, (err) => {
    if(err) return next(err);

    res.send({
      error_code: 0,
      data: '删除成功'
    })

  })
});



module.exports = router;

