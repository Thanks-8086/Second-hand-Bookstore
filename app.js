//app.js
App({
  // 全局变量
  globalData: {
    //发布者信息
    avatarUrl: '/icons./user-unlogin.png', //用户头像
    userName: "", //用户名
  },

  onLaunch: function() {
    //云开发初始化
    wx.cloud.init({
      env: 'xiaocaiji-ltzvh',
    })
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userName = res.userInfo.nickName
              this.globalData.avatarUrl = res.userInfo.avatarUrls
              // console.log("名字", this.globalData.userInfo)
              // console.log("头像", this.globalData.avatarUrl)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  //获取当前时间,返回时间格式：2018-09-16
  getNowFormatDate: function() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
})