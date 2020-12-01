//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    booklist: [],
  },

  onLoad: function () {
    wx.cloud.database().collection("bookInformation").orderBy('date', 'desc')
    .where({
      userName: app.globalData.userName
      }).get({
      success: (res) => {
        console.log("请求成功", res.data)
        this.setData({
          booklist: res.data
        })
        console.log("赋值成功", res.data)
      },
      fail(res) {
        console.log("请求失败", res)
      }
    })
  },
  //转到书籍详情页
  toDetail: function (e) {
    let blogId = e.currentTarget.dataset.id
    console.log('传入的currentTarget', e.currentTarget)
    console.log('传入的——id', blogId)
    wx.navigateTo({
      url: '/pages/bookdetail/bookdetail?_id=' + blogId,
    })
  },

  deletebook: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id
    //var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定这本书卖出了吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          wx.cloud.database().collection("bookInformation").doc(id).update({
            data:{
              soldout:false
            }
          })
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          images
        });
      }
    })
  }
})
