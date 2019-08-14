/**
 * @Author QJ
 * @date 2019--13 12:05
 * @desc goods.js
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const GoodsSchema = Schema({
  goods_id: {
    type: Schema.Types.ObjectId,
    index: true,
    unique: true,
    required: true
  },
  goods_name: {
    type: String,
    index: true,
    required: true
  },
  origin_price: {
    type: String,
    set: function(val) {
      return Number(val).toFixed(2);
    }
  },
  price: {
    type: String,
    required: true,
    set(val) {
      return Number(val).toFixed(2)
    }
  },
  small_image: {
    type: Schema.Types.ObjectId,
    required: true
  },
  ctime: {
    type: String,
    default: Date.now()
  },
  del: {
    type: Number,
    default: 0
  }
});

const GoodsModel = mongoose.model('goods', GoodsSchema);

module.exports = GoodsModel;
