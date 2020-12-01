// pages/my/my.js
const app = getApp()
const config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '/icons/user-unlogin.png', //用户头像
    userInfo: "", //用户名
    logged: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo.nickName
              })
            }
          })
        }
      }
    })
  },

  // 获取头像昵称信息
  onGetUserInfo: function(e) {
    console.log(e)
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo.nickName
      })
    }
  },
  /**
     * 展示打赏二维码
     * @param {} e 
     */
  showQrcode: function (e) {
    wx.previewImage({
      current: config.moneyUrl,
      urls: ["https://7869-xiaocaiji-ltzvh-1301969075.tcb.qcloud.la/QQ%E5%9B%BE%E7%89%8720200430212634.png?sign=30521b59719eff3f8cb9bee9c0633f87&t=1588253316"],
    })
  },
 
// 
  opinion:function(e){
    wx.navigateTo({
      url: '../my/opinions/opinions'
    })
  },
  keep: function (e) {
    wx.navigateTo({
      url: '../my/myKeep/myKeep'
    })
  },
  like: function (e) {
    wx.navigateTo({
      url: '../my/myLike/myLike'
    })
  },
  want: function (e) {
    wx.navigateTo({
      url: '../my/myWant/myWant'
    })
  },
  put: function (e) {
    wx.navigateTo({
      url: '../my/myPublish/myPublish'
    })
  },

//
  useInstruction:function(e){
    wx.navigateTo({
      url: '../my/useInstruction/useInstruction'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})