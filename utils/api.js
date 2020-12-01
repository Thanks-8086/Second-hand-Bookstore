wx.cloud.init()
const db = wx.cloud.database()

/**
 * 获取评论列表
 * @param {} page 
 * @param {*} postId 
 */
function getPostComments(postId) {
  return db.collection('bookComments')
    .where({
      postId: postId,
    })
    .orderBy('timestamp', 'desc')
    .get()
}

/**
 * 新增用户收藏文章
 */
function addPostCollection(data) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "addPostCollection",
      postId: data.postId,
      operator: data.operator,
      type: data.type
    }
  })
}

/**
 * 新增用户想要文章
 */
function addPostWant(data) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "addPostWant",
      postId: data.postId,
      operator: data.operator,
      type: data.type
    }
  })
}
/**
 * 取消喜欢或收藏或想要
 */
function deletePostCollectionOrZan(postId, type) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "deletePostCollectionOrZan",
      postId: postId,
      type: type
    }
  })
}

/**
 * 新增评论
 */
function addPostComment(commentContent) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "addPostComment",
      commentContent: commentContent,
    }
  })
}

/**
 * 新增用户点赞
 * @param {} data 
 */
function addPostZan(data) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "addPostZan",
      postId: data.postId,
      operator: data.operator,
      type: data.type
    }
  })
}

/**
 * 新增子评论
 * @param {} id 
 * @param {*} comments 
 */
function addPostChildComment(id, postId, comments) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "addPostChildComment",
      id: id,
      comments: comments,
      postId: postId,
    }
  })
}

module.exports = {
  addPostCollection: addPostCollection, //
  addPostZan: addPostZan, //
  deletePostCollectionOrZan: deletePostCollectionOrZan, //
  addPostComment: addPostComment, //
  addPostChildComment: addPostChildComment, //
  getPostComments: getPostComments, //
  addPostWant: addPostWant, //
}