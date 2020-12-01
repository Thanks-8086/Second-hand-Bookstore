// pages/my/opinions/opinions.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: ""
  },

  sendQues() {
    let question = this.data.question
    let time = new Date()
    let that = this
    if (question === "") {
      wx.showToast({
        title: '请输入您的反馈！',
        icon: 'none',
      })
    } else {
      wx.cloud.database().collection("Question").add({
        data: {
          question: question,
          createtime: time
        },
        success(res) {
          wx.showToast({
            title: '感谢您的反馈！',
            icon: 'none',
          })
          that.setData({
            question: ""
          })
        },
        fail(err) {
          wx.showToast({
            title: '不好意思出了点小问题',
            icon: 'none',
          })
          console.log("错误信息", err)
        }
      })
    }
  },

  questionInput: function(e) {
    console.log(e.detail.value)
    this.setData({
      question: e.detail.value
    })
  }
})