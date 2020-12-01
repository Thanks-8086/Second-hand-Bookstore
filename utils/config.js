/**
 * 打赏二维码
 */
var moneyUrl = "https://7869-xiaocaiji-ltzvh-1301969075.tcb.qcloud.la/QQ%E5%9B%BE%E7%89%8720200430212634.png?sign=30521b59719eff3f8cb9bee9c0633f87&t=1588253316"


/**
 * 个人文章操作枚举
 */
var postRelatedType = {
  COLLECTION: 1,
  ZAN: 2,
  WANT:3,
  properties: {
    1: {
      desc: "收藏"
    },
    2: {
      desc: "超赞"
    },
    3: {
      desc: "想要"
    }
  }
};


module.exports = {
  postRelatedType: postRelatedType,
  moneyUrl: moneyUrl,
}