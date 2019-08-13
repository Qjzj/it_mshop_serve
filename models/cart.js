/**
 * @Author QJ
 * @date 2019--13 12:00
 * @desc cart.js
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = Schema({
  goods_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  num: {
    type: Number,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  del: {
    type: Number,
    default: 0
  },
  ctime: {
    type: String,
    default: Date.now()
  }
});

const CartModel = mongoose.model('carts', CartSchema);

module.exports = CartModel;
