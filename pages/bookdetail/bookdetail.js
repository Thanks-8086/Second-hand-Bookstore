// pages/bookdetail/bookdetail.js
const api = require('../../utils/api.js')
const config = require('../../utils/config.js')
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '', //用户头像
    usrName: '', //用户昵称

    book: {}, //该书籍的所有信息
    _id: "", //通过传入id来获得详情页消息

    nodata: false,
    nodata_str: "暂无评论，赶紧抢沙发吧",
    commentList: [], //评论列表
    commentId: '',
    commentContent: '', //评论框内容
    placeholder: '留言获取更多信息吧~',
    toName: "",
    focus: false,
    childCommentShow: false, //子评论信息默认不显示

    collection: {
      status: false,
      icon: "/icons/shoucang-no.png"
    },
    zan: {
      status: false,
      icon: "/icons/dianzan-no.png"
    },
    want: {
      status: false,
      icon: "/icons/want-no.png"
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let _id = options._id
    that.setData({
      avatarUrl: app.globalData.avatarUrl, //用户头像
      usrName: app.globalData.userName, //用户昵称
      //commentList: api.getPostComments(_id).data, //通过_id获取评论列表
    })
    db.collection('bookComments')
      .where({
        postId: _id,
      })
      .orderBy('timestamp', 'desc')
      .get({
        success: (res) => {
          console.log("commentList", res)
          this.setData({
            commentList: res.data
          })
          console.log("评论列表", that.data.commentList)
        },
        fail(err) {
          console.log("查询评论列表失败", err)
        }
      })
    console.log("用户昵称", that.data.usrName)
    console.log("用户头像", that.data.avatarUrl)
    

    // 传入id获取书籍具体信息book
    db.collection('bookInformation').doc(_id).get({
      success(res) {
        console.log("请求书籍信息成功", res.data)
        that.setData({
          book: res.data
        })
      },
      fail(res) {
        console.log("请求书籍信息失败", res)
      }
    })
    //获取该用户的点赞、收藏、想要状态
    db.collection('books_related').where({
      postId: _id,
      operator: that.data.usrName,
      type: 2
    }).get({
      success(res) {
        console.log("查询点赞等成功", res)
        if (res.data.length) {
          that.setData({
            zan: {
              status: true,
              icon: "/icons/dianzan-yes.png"
            }
          })
        }
      },
      fail(res) {
        console.log("查询点赞等失败", res)
      }
    })
    db.collection('books_related').where({
      postId: _id,
      operator: that.data.usrName,
      type: 1
    }).get({
      success(res) {
        console.log("查询收藏等成功", res.data)
        if (res.data.length) {
          that.setData({
            collection: {
              status: true,
              icon: "/icons/shoucang-yes.png"
            }
          })
        }
      },
      fail(res) {
        console.log("查询收藏等失败", res)
      }
    })
    db.collection('books_related').where({
      postId: _id,
      operator: that.data.usrName,
      type: 3
    }).get({
      success(res) {
        console.log("查询想要等成功", res.data)
        if (res.data.length) {
          that.setData({
            want: {
              status: true,
              icon: "/icons/want-yes.png"
            }
          })
        }
      },
      fail(res) {
        console.log("查询想要等失败", res)
      }
    })
  },
  // 预览图片
  previewImg: function(e) {
    let imgData = e.currentTarget.dataset.img;
    console.log("eeee", imgData[0])
    console.log("图片s", imgData[1])
    wx.previewImage({
      //当前显示图片
      current: imgData[0],
      //所有图片
      urls: imgData[1]
    })
  },
  // 返回书城首页
  onUnload: function() {
    wx.reLaunch({
      url: '../books/books'
    })
  },

  //评论框输入
  commentInput: function(e) {
    this.setData({
      commentContent: e.detail.value
    })
  },

  /**
   * 提交评论
   * @param {} e 
   */
  formSubmit: function(e) {
    try {
      let that = this;
      let content = that.data.commentContent;
      console.info("评论输入内容", content)
      if (content == undefined || content == "") {
        wx.showToast({
          title: '请输入内容',
          icon: 'none',
          duration: 1500
        })
        return
      }

      that.submitContent(content)
      wx.showLoading({
        title: '加载中...',
      })
    } catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      console.log("错误", err)
    }
    wx.hideLoading()
  },

  /**
   * 将评论上传
   */
  submitContent: function(content) {
    let that = this
    if (that.data.commentId === "") {
      var data = {
        postId: that.data.book._id,
        cNickName: that.data.usrName,
        cAvatarUrl: that.data.avatarUrl,
        timestamp: new Date().getTime(),
        createDate: app.getNowFormatDate(),
        comment: content,
        childComment: [],
        flag: 1
      }
      api.addPostComment(data)
    }
    //子评论
    else {
      var childData = [{
        cNickName: that.data.usrName,
        cAvatarUrl: that.data.avatarUrl,
        timestamp: new Date().getTime(), //new Date(),
        createDate: app.getNowFormatDate(),
        comment: content,
        tNickName: that.data.toName,
        flag: 1
      }]
      that.addPostChildComment(that.data.commentId, that.data.book._id, childData)
      // console.log("添加子评论成功")
    }

    //let commentList = api.getPostComments(that.data.book._id)
    db.collection('bookComments')
      .where({
        postId: that.data.book._id,
      })
      .orderBy('timestamp', 'desc')
      .get({
        success(res) {
          console.log("查询评论列表res", res)
          that.data.commentList = res.data
          // that.setData({
          //   commentList: res.data
          // })
          console.log("数据commentList设置成功", that.data.commentList)
        },
        fail(err){
          console.log("查询评论列表失败", err)
        }
      })
    console.log("commentList", that.data.commentList)
    if (that.data.commentList.length) {
      let book = that.data.book;
      book.totalComments = book.totalComments + 1
      that.setData({
        commentList: that.data.commentList,
        commentContent: "",
        nodata: false,
        book: book, //评论数+1
        commentId: "",
        placeholder: "评论...",
        focus: false,
        toName: "",
      })
    }

    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 1500
    })
  },

  /**
   * 点击评论内容回复
   */
  focusComment: function(e) {
    let that = this;
    console.log("e.currentTarget.dataset", e.currentTarget.dataset)
    let name = e.currentTarget.dataset.name; //该评论的作者
    let commentId = e.currentTarget.dataset.id;

    that.setData({
      commentId: commentId,
      placeholder: "回复" + name + ":",
      focus: true,
      toName: name,
    });
  },

  // 点击图标显示子评论
  childShow: function(e) {
    let that = this
    that.setData({
      childCommentShow: !that.data.childCommentShow
    })
  },
  /**
   * 新增子评论
   * @param {} id 
   * @param {*} comments 
   */
  addPostChildComment(id, postId, comments) {
    console.log("id是啥",id)
    return wx.cloud.callFunction({
      name: 'postsService',
      data: {
        action: "addPostChildComment",
        id: id,
        comments: comments,
        postId: postId,
      }
    })
  },
  /**
   * 失去焦点时
   * @param {*} e 
   */
  onReplyBlur: function(e) {
    let that = this;
    const text = e.detail.value.trim();
    if (text === '') {
      that.setData({
        commentId: "",
        placeholder: "评论...",
        toName: ""
      });
    }
  },
  /**
   * 收藏功能
   */
  postCollection: function() {
    wx.showLoading({
      title: '加载中...',
    })
    try {
      let that = this;
      let collection = that.data.collection;
      if (collection.status === true) {
        let result = api.deletePostCollectionOrZan(that.data.book._id, config.postRelatedType.COLLECTION)
        console.info(result)
        that.setData({
          collection: {
            status: false,
            icon: "/icons/shoucang-no.png"
          }
        })
        wx.showToast({
          title: '已取消收藏',
          icon: 'success',
          duration: 1500
        })
      } else {
        let data = {
          postId: that.data.book._id,
          operator: that.data.usrName,
          type: config.postRelatedType.COLLECTION
        }
        api.addPostCollection(data)
        that.setData({
          collection: {
            status: true,
            icon: "/icons/shoucang-yes.png"
          }
        })

        wx.showToast({
          title: '已收藏',
          icon: 'success',
          duration: 1500
        })
      }
    } catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      console.info(err)
    } finally {
      wx.hideLoading()
    }

  },
  /**
   * 点赞功能
   */
  postZan: function() {
    wx.showLoading({
      title: '加载中...',
    })
    try {
      let that = this;
      let zan = that.data.zan;
      if (zan.status === true) {
        let result = api.deletePostCollectionOrZan(that.data.book._id, config.postRelatedType.ZAN)
        console.info(result)
        that.setData({
          zan: {
            status: false,
            icon: "/icons/dianzan-no.png"
          }
        })
        wx.showToast({
          title: '已取消点赞',
          icon: 'success',
          duration: 1500
        })
      } else {
        let data = {
          postId: that.data.book._id,
          operator: that.data.usrName,
          type: config.postRelatedType.ZAN
        }
        api.addPostZan(data)
        that.setData({
          zan: {
            status: true,
            icon: "/icons/dianzan-yes.png"
          }
        })

        wx.showToast({
          title: '已赞',
          icon: 'success',
          duration: 1500
        })
      }
    } catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      console.info(err)
    } finally {
      wx.hideLoading()
    }
  },
  //想要
  postWant: function() {
    wx.showLoading({
      title: '加载中...',
    })
    try {
      let that = this;
      let want = that.data.want;
      if (want.status === true) {
        let result = api.deletePostCollectionOrZan(that.data.book._id, config.postRelatedType.WANT)
        console.info(result)
        that.setData({
          want: {
            status: false,
            icon: "/icons/want-no.png"
          }
        })
        wx.showToast({
          title: '已取消想要',
          icon: 'success',
          duration: 1500
        })
      } else {
        let data = {
          postId: that.data.book._id,
          operator: that.data.usrName,
          type: config.postRelatedType.WANT
        }
        api.addPostWant(data)
        that.setData({
          want: {
            status: true,
            icon: "/icons/want-yes.png"
          }
        })
        wx.showToast({
          title: '已想要',
          icon: 'success',
          duration: 1500
        })
      }
    } catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      console.info(err)
    } finally {
      wx.hideLoading()
    }
  },
})