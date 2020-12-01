//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    booklist: [],
    book_id: [],
    nodata: false
  },

  onLoad: function () {
    console.log("用户名", app.globalData.userName)

    wx.cloud.database().collection("books_related").orderBy('createTime', 'desc')
      .where({
        operator: app.globalData.userName,
        //operator: "一只特立独行的🐶",
        type: 3
      }).get({
        success: (res) => {
          this.setData({
            book_id: res.data
          })
          console.log("赋值id成功", book_id)
        },
        fail(res) {
          console.log("请求id失败", res)
        }
      })

    wx.cloud.database().collection("bookInformation").orderBy('createTime', 'desc')
      .get({
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
})