// pages/fabu/fabu.js
let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bookName: "",
    price: null,
    desc: "",
    labelItems: ["课本", "辅导书", "工具书", "课外书"],
    labelCur: -1, //标签选择标志

    // 图片选择
    imgList: [],
    fileIDs: [],
    //发布者信息
    userName: app.globalData.userName,
    avatarUrl: app.globalData.avatarUrl
  },

  // onLoad: function (e){
  //   console.log("名字", app.globalData.userInfo,
  //   console.log("头像", app.globalData.avatarUrl
  // },

  //书名输入
  bookInput: function(e) {
    this.setData({
      bookName: e.detail.value
    })
  },

  //价格输入
  priceInput: function(e) {
    this.setData({
      price: e.detail.value
    })
  },

  //书具体描述输入
  detailInput: function(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  //标签被选择
  labelSelect: function(e) {
    let labelCur = e.currentTarget.dataset.id
    this.setData({
      labelCur: labelCur
    })
  },

  //增加图片
  ChooseImage() {
    wx.chooseImage({
      count: 9 - this.data.imgList.length, //默认9,我们这里最多选择9张
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log("选择图片成功", res)
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  //删除图片
  DeleteImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },

  //发布书籍消息
  sendBook: function(e) {
    let bookName = this.data.bookName
    let price = this.data.price
    let imgList = this.data.imgList
    if (bookName.length < 1) {
      wx.showToast({
        icon: "none",
        title: '书名不能为空'
      })
      return
    }
    if (!price) {
      wx.showToast({
        icon: "none",
        title: '价格不能为空'
      })
      return
    }
    if (!imgList || imgList.length < 1) {
      wx.showToast({
        icon: "none",
        title: '请选择图片'
      })
      return
    }
    wx.showLoading({
      title: '发布中...',
    })

    const promiseArr = []
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.imgList.length; i++) {
      let filePath = this.data.imgList[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log("上传结果", res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log("上传失败", error)
        })
      }))
    }
    //保证所有图片都上传成功
    let db = wx.cloud.database()
    Promise.all(promiseArr).then(res => {
      db.collection('bookInformation').add({
        data: {
          bookName: this.data.bookName,
          price: this.data.price,
          labelCur: this.data.labelCur,
          likeNum: 0,
          keepNum: 0,
          wantNum: 0,
          soldout:true,
          totalComments: 0,
          fileIDs: this.data.fileIDs,
          date: app.getNowFormatDate(),
          createTime: db.serverDate(),
          desc: this.data.desc,
          images: this.data.imgList,
          avatarUrl: app.globalData.avatarUrl,
          userName: app.globalData.userName
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
          })
          console.log('发布成功', res)
          wx.redirectTo({
            url: '../bookdetail/bookdetail?_id=' + res._id,
          })
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '网络不给力....'
          })
          console.error('发布失败', err)
        }
      })
    })
  },
  onLoad: function(option) {
    console.log("userInfo", app.globalData.userName)
    console.log("avatarUrl", app.globalData.avatarUrl)
  }
})