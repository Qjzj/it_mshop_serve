/**
 * @Author QJ
 * @date 2019--17 10:12
 * @desc resources.js
 */
const express = require('express');
const formidable = require('formidable');
const utils = require('../utils/utils');
const Resource = require('../models/resources');
const User = require('../models/users');
const path = require('path');

const router = express.Router();

router.post('/api/create', (req, res, next) => {
    const form = formidable.IncomingForm();
    form.uploadDir = utils.getUploadDir();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if(!err) {
            const basename = path.basename(files['cover_img'].path);
            fields.cover_img = '/' + utils.formatDate('yyyyMMdd') + '/' + basename;
            let resource = new Resource({
                title: fields.title,
                summary: fields.summary,
                author: JSON.parse(req.session.token)._id,
                content: fields.content,
                cover_img: fields.cover_img
            });

            resource.save((err, result) => {
                if(!err) {
                    console.log(result);
                    res.send({
                        error_code: 0,
                        result: '添加资源文章成功'
                    })
                }
                console.log(err);
            })
        }
    })





});
/**
 * 更新单个资源文章
 */
router.post('/api/update/:id', (req, res, next) => {
    const id = req.params.id;
    const form = formidable.IncomingForm();
    form.uploadDir = utils.getUploadDir();

    form.parse(req, (err, fields, files) => {
        if(!err) {
            // 有新上传的图片
            if(files.cover_img) {

                fields.cover_img = '/' + utils.formatDate('yyyyMMdd') + path.basename(files['cover_img'].path);
            }

            Resource.findById(id, (err, resource) => {
                if(!err) {
                    resource.title = fields.title;
                    resource.summary = fields.summary;
                    resource.cover_img = fields.cover_img;
                    resource.content = fields.content;
                    resource.mtime = Date.now()

                    resource.save((err, result) => {
                        if(!err) {
                            console.log(result);
                            res.send({
                                error_code: 0,
                                result: '修改资源文章成功'
                            })
                        }
                        console.log(err);

                    })
                }

                console.log(err);
            })

        }
    })
});
/**
 * 根据id查询单个文章
 */
router.get('/api/get/:id', (req, res, next) => {
   const id = req.params.id ;
   Resource.findById(id, (err, result) => {
       result = JSON.parse(JSON.stringify(result));
       if(!err) {
           User.findById(result['author'], '-_id -salt -super', (err, user) => {
               if(!err) {
                   result['_author'] = user;
                   res.send({
                       error_code: 0,
                       result: result
                   })
               }
           })
       }


       console.log(err);
   })
});
/**
 * 查询所有的资源文章
 */
router.get('/api/search', (req, res, next) => {
    Resource.find((err, result) => {
        let current = 0;
        result = JSON.parse(JSON.stringify(result));
        for(let i=0; i<result.length; i++) {
            User.findById(result[i]['author'], '-_id -user_pwd -super', (err, user) => {
                current ++;
                if(!err) {
                    result[i]['_author'] = user;
                    if(current === result.length) {
                        res.send({
                            error_code: 0,
                            result: result
                        })
                    }
                }

            })
        }
        console.log(err);
    })
});
/**
 * 增加阅读数量
 */
router.get('/api/add_read/:id', (req, res, next) => {
    const id = req.params.id;
    Resource.findByIdAndUpdate(id, {$inc: {read_count: 1}}, (err, result) => {
        if(!err) {
            res.send({
                error_code: 0,
                result: 'OK'
            })
        }
        console.log(err);
    })
});
/**
 * 更新收藏数量 query {flag： D(-1)}
 */
router.get('/api/up_collect/:id', (req, res, next) => {
    let operate = req.query.flag;
    const id = req.params.id;
    const num = operate === 'D' ? -1 : 1;
    Resource.findByIdAndUpdate(id, {$inc: {read_count: num}}, (err, result) => {
        if(!err) {
            res.send({
                error_code: 0,
                result: 'OK'
            })
        }
        console.log(err);
    })
});








module.exports = router;
