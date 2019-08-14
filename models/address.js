/**
 * @Author QJ
 * @date 2019--14 11:31
 * @desc address.js
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  name: {       // 姓名
    type: String,
    required: true
  },
  phone: {    // 电话
    type: String,
    required: true
  },
  address: {   // 详细地址
    type: String,
    required: true
  },
  user_id: {   // 所属用户
    type: Schema.Types.String,
    required: true
  },
  area: {    // 选择地区（暂未使用）
    type: String
  }
});

const AddressModel = mongoose.model('address', AddressSchema);

module.exports = AddressModel;
