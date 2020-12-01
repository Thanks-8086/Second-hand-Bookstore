// pages/books/books.js
const api = require('../../utils/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //搜索框
    isSearch: true,
    isClear: false,
    filter: "", //搜索框内容

    //标签切换
    navItems: [{
      name: '最新',
      index: 1
    }, {
      name: '热门',
      index: 2
    }, {
      name: '标签',
      index: 3
    }],
    tabCur: 1, //被点击的菜单索引
    hotItems: ["想要最多", "评论最多", "点赞最多", "收藏最多"],
    labelList: ["全部", "课本", "辅导书", "工具书", "课外书"],
    hotCur: 0, //热门标签选择
    labelCur: 0, //标签选择
    nodata: false, //查询文章不存在显示标签
    nomore: false,
    // scrollLeft: 0,//横向最大滚动长度限制
    showHot: false,
    showLabels: false,
    booklist: [], //已发布书籍信息

  },

  onLoad: function(option) {
    //云函数书籍信息时间顺序排列
    this.getPostsList('', 'createTime')
  },

  //搜索框
  //获取搜索内容
  getInput: function(e) {
    this.setData({
      filter: e.detail.value
    })
    if (this.data.filter.length > 0) {
      this.setData({
        isSearch: false,
        isClear: true,
      })
    } else {
      this.setData({
        isSearch: true,
        isClear: false,
      })
    }
  },
  //清除输入
  clearTap: function(e) {
    this.setData({
      filter: "",
      isSearch: true,
      isClear: false,
    })
  },
  //点击搜索利用云函数(err)
  searchTap: function(e) {
    let that = this
    let filter = filter
    that.setData({
      booklist: [],
      nomore: false,
      nodata: false,
    })
    this.getPostsList(that.data.filter, 'createTime')
  },

  /**
   * tab切换
   * @param {} e 
   */
  tabSelect: function(e) {
    let that = this;
    console.log("tag切换", e.currentTarget.dataset.id);
    let tabCur = e.currentTarget.dataset.id
    switch (tabCur) {
      case 1:
        {
          that.setData({
            tabCur: e.currentTarget.dataset.id,
            // scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
            nomore: false,
            nodata: false,
            showHot: false,
            showLabels: false,
            booklist: [],
          })

          that.getPostsList("", 'createTime')
          break
        }
      case 2:
        {
          that.setData({
            booklist: [],
            tabCur: e.currentTarget.dataset.id,
            // scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
            showHot: true,
            showLabels: false,
            nomore: false,
            nodata: false,
          })
          that.getPostsList("", "wantNum")
          break
        }
      case 3:
        {
          that.setData({
            tabCur: e.currentTarget.dataset.id,
            // scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
            showHot: false,
            showLabels: true,
          })
          that.getPostsList("", 'createTime')
          break
        }
    }
  },

  /**
   * 热门按钮切换
   * @param {*} e 
   */
  hotSelect: function(e) {
    console.log("tag切换", e.currentTarget.dataset.id)
    let that = this
    let hotCur = e.currentTarget.dataset.id
    let orderBy = "createTime"
    switch (hotCur) {
      //想要最多
      case 0:
        {
          orderBy = "wantNum"
          break
        }
        //评论最多
      case 1:
        {
          orderBy = "commentNum"
          break
        }
        //点赞最多
      case 2:
        {
          orderBy = "likeNum"
          break
        }
        //收藏最多
      case 3:
        {
          orderBy = "keepNum"
          break
        }
    }
    that.setData({
      booklist: [],
      hotCur: hotCur,
      nomore: false,
      nodata: false,
    })
    that.getPostsList("", orderBy)
  },

  /**
   * 标签按钮切换
   * @param {*} e 
   */
  labelSelect: function(e) {
    let that = this
    let labelCur = e.currentTarget.dataset.id
    let orderBy = "createTime"
    // switch (labelCur) {
    //   //全部
    //   case -1:
    //     {
    //       label = "createTime"
    //       break
    //     }
    //     //课本
    //   case 0:
    //     {
    //       label = "nearNew"
    //       break
    //     }
    //     //辅导书
    //   case 1:
    //     {
    //       label = "teachBook"
    //       break
    //     }
    //     //工具书
    //   case 2:
    //     {
    //       label = "helpBook"
    //       break
    //     }
    //     //课外书
    //   case 3:
    //     {
    //       label = "useBook"
    //       break
    //     }
    // }
    that.setData({
      booklist: [],
      labelCur: labelCur,
      nomore: false,
      nodata: false,
    })
    that.getPostsList("", orderBy, labelCur)
  },

  /**
   * 返回
   */
  navigateBack: function(e) {
    wx.switchTab({
      url: '../index/index'
    })
  },

  //转到书籍详情页
  toDetail: function(e) {
    let blogId = e.currentTarget.dataset.id
    console.log('传入的currentTarget', e.currentTarget)
    console.log('传入的——id', blogId)
    wx.navigateTo({
      url: '../bookdetail/bookdetail?_id=' + blogId,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this;
    that.setData({
      booklist: [],
      filter: "",
      nomore: false,
      nodata: false,
    })
    this.getPostsList("")
    wx.stopPullDownRefresh()
  },
  /**
   * 获取文章列表
   */
  getPostsList: function(filter, orderBy, label) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    if (that.data.nomore) {
      wx.hideLoading()
      return
    }
    wx.cloud.callFunction({
      name: "getPostsList",
      data: {
        filter: that.data.filter,
        orderBy: that.data.orderBy,
        labelCur: that.data.labelCur
      },
      success:(res)=>{
        console.log('333333333成功', res)
        if (res.result.data.length === 0) {
          that.setData({
            nomore: true,
            nodata: true
          })
        } else {
          that.setData({
            booklist: res.result.data,
          })
        }
        wx.hideLoading()
      },
      fail(res) {
        console.log('333333333失败', res)
      }
    })
    
  }
})