/**
 * @Author QJ
 * @date 2019--13 14:50
 * @desc upload.js
 */
const express = require('express');
const formidable = require('formidable');
const path = require('path');
const utils = require('../utils/utils');
const Document = require('../models/documents');
const router = express.Router();

router.post('/api/upload', (req, res, next) => {
  const form = formidable.IncomingForm();
  form.uploadDir = utils.getUploadDir();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
     if(!err) {
       const file = files['file'];
       console.log(file);
       const basename = path.basename(file.path);
       const url = '/' + utils.formatDate('yyyyMMdd') + '/' + basename;
       const sdocument = new Document({
         name: file.name,
         type: file.type,
         url: url,
         ctime: Date.now()
       });

       sdocument.save((err, document) => {
         if(!err) {
           res.send({
             error_code: 0,
             data: document,
             message: '图片上传成功'
           })
         }else {
           console.log('图片上传出错');
           console.log(err);

         }
       })
     }
  })
});

router.post('/api/upalod_del/:id', (req, res) => {
  const id = req.params.id;
  Document.findByIdAndDelete(id, (err, result) => {
    if(err) {
      console.log('数据库出错');
      console.log(err);
    }
    res.send({
      error_code: 0,
      data: result,
      message: null
    })
  })
});


module.exports = router;
