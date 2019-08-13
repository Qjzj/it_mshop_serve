/**
 * @Author QJ
 * @date 2019--13 15:19
 * @desc documents.js
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = Schema({
  name: {
    type: String,
  },
  type: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  dir: {
    type: Number,  // 0 目录 1 文件
    default: 0
  },
  pid: {
    type: Schema.Types.ObjectId,
  },
  del: {
    type: Number,   // 0 删除 1 未删除
    default: 0
  },
  ctime: {
    type: String,
    default: Date.now()
  }
});

const DocumentModel = mongoose.model('documents', DocumentSchema);

module.exports = DocumentModel;
