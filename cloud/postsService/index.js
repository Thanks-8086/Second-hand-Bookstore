// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
// 云函数入口函数
exports.main = async(event, context) => {
  switch (event.action) {
    case 'addPostComment':
      {
        return addPostComment(event)
      }
    case 'addPostChildComment':
      {
        return addPostChildComment(event)
      }
    case 'addPostCollection':
      {
        return addPostCollection(event)
      }
    case 'deletePostCollectionOrZan':
      {
        return deletePostCollectionOrZan(event)
      }
    case 'addPostZan':
      {
        return addPostZan(event)
      }
    case 'addPostWant':
      {
        return addPostWant(event)
      }

    default:
      break
  }


  /**
   * 新增评论
   * @param {} event 
   */
  async function addPostComment(event) {

    console.info("处理addPostComment")

    let task = db.collection('bookInformation').doc(event.commentContent.postId).update({
      data: {
        totalComments: _.inc(1)
      }
    })

    event.commentContent.flag = 0
    await db.collection("bookComments").add({
      data: event.commentContent
    });

    let result = await task;
  }

  /**
   * 新增子评论
   * @param {} event 
   */
  async function addPostChildComment(event) {

    let task = db.collection('bookInformation').doc(event.postId).update({
      data: {
        totalComments: _.inc(1)
      }
    });

    event.comments[0].flag = 0

    await db.collection('bookComments').doc(event.id).update({
      data: {
        childComment: _.push(event.comments)
      }
    })
    await task;
  }

  /**
   * 处理文章收藏
   * @param {*} event 
   */
  async function addPostCollection(event) {
    let postRelated = await db.collection('books_related').where({
      operator: event.operator,
      postId: event.postId,
      type: event.type
    }).get();

    let task = db.collection('bookInformation').doc(event.postId).update({
      data: {
        keepNum: _.inc(1)
      }
    });

    if (postRelated.data.length === 0) {
      await db.collection('books_related').add({
        data: {
          postId: event.postId,
          operator: event.operator,
          type: event.type,
        }
      });
    }
    let result = await task;
    console.info(result)
  }

  /**
   * 处理赞
   * @param {} event 
   */
  async function addPostZan(event) {
    let postRelated = await db.collection('books_related').where({
      operator: event.operator,
      postId: event.postId,
      type: event.type
    }).get();

    let task = db.collection('bookInformation').doc(event.postId).update({
      data: {
        likeNum: _.inc(1)
      }
    });

    if (postRelated.data.length === 0) {
      await db.collection('books_related').add({
        data: {
          postId: event.postId,
          operator: event.operator,
          type: event.type,
        }
      })
      console.log("添加赞成功")
    }
    let result = await task;
    console.info(result)
  }
  /**
   * 处理想要
   * @param {} event 
   */
  async function addPostWant(event) {
    let postRelated = await db.collection('books_related').where({
      operator: event.operator,
      postId: event.postId,
      type: event.type
    }).get();

    let task = db.collection('bookInformation').doc(event.postId).update({
      data: {
        wantNum: _.inc(1)
      }
    });

    if (postRelated.data.length === 0) {
      await db.collection('books_related').add({
        data: {
          postId: event.postId,
          operator: event.operator,
          type: event.type,
        }
      })
      console.log("添加赞成功")
    }
    let result = await task;
    console.info(result)
  }
  /**
   * 移除收藏/赞/想要
   * @param {} event 
   */
  async function deletePostCollectionOrZan(event) {
    //TODO:文章喜欢总数就不归还了？
    let result = await db.collection('books_related').where({
      operator: event.operator,
      postId: event.postId,
      type: event.type,
    }).remove()
    console.info(result)
    switch (event.type) {
      case 1:
        {
          await db.collection('bookInformation').doc(event.postId).update({
            data: {
              keepNum: _.inc(-1)
            }
          })
          break
        }
      case 2:
        {
          await db.collection('bookInformation').doc(event.postId).update({
            data: {
              likeNum: _.inc(-1)
            }
          })
          break
        }
      case 3:
        {
          await db.collection('bookInformation').doc(event.postId).update({
            data: {
              wantNum: _.inc(-1)
            }
          })
          break
        }
    }
  }
}