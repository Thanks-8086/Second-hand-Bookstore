// pages/login/login.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  next: function (e) {
    console.log("userInfo", app.globalData.userName)
    wx.switchTab({
      url: '/pages/books/books',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success(res) {
        if (res.code) {
          // //发起网络请求
          // wx.request({
          //   url: 'https://test.com/onLogin',
          //   data: {
          //     code: res.code
          //   }
          // })
          // 查看是否授权
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success: function (res) {
                    console.log(res.userInfo)
                    app.globalData.userName = res.userInfo.nickName
                    app.globalData.avatarUrl = res.userInfo.avatarUrl
                    that.next();
                  }
                })
              }
            }
          })

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },

  bindGetUserInfo(e) {
    console.log("信息",e.detail.userInfo)
    app.globalData.userName = e.detail.userInfo.nickName
    app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
    if (e.detail.userInfo == undefined) {
    }
    else {
      this.next();
    }
  },
})