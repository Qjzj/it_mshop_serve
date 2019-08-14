/**
 * @Author QJ
 * @date 2019--14 11:15
 * @desc order.js
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

/**
 * 预定义模式修饰符
 * lowercase: bool
 * uppercase: bool
 * trim: bool
 * set fun
 * get fun (一般不用)
 */

/**
 * 设置索引
 *  index bool 一般索引
 *  unique bool 唯一索引’
 */

/**
 * 校验方法
 * required: bool 必传
 * max number类型 最大值
 * min number类型 最小值
 * enum 枚举类型  enum:['1', '2', '3']
 * match 符合match的正则
 * maxlength 最大长度
 * minlength 最小长度
 * validate fun 自定义校验 return bool
 */

const OrderSchema = new Schema({
  goods_id: {   // 商品id
    type: Schema.Types.ObjectId,
    required: true,
  },
  num: {       // 数量
    type: Number,
    required: true
  },
  price: {      // 价格
    type: String,
    required: true,
    set(val) {
      return Number(val).toFixed(2);
    }
  },
  all_price: {
    type: String,
    required: true,
    set(val) {
      return Number(val).toFixed(2);
    }
  },
  address_id: {   // 地址id
    type: Schema.Types.ObjectId,
    required: true
  },
  user_id: {    // 所属用户
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  status: {     // 订单状态
    type: String,   // 0 代付款 1 已付款/待发货(付款之后交易结束) 2 运输中(未使用) 3 已收货 4 已评价(未使用) 5 已取消
    enum: ['0', '1', '2', '3', '4', '5'],
    default: '0'
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

const OrderModel = mongoose.model('orders', OrderSchema);

module.exports = OrderModel;
