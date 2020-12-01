// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  let where = {}
  if (event.filter !== '') {
    where.bookName = cloud.database().RegExp({
      regexp: event.filter,
      options: 'i',
    })
  }

  if (event.orderBy == undefined || event.orderBy == "") {
    event.orderBy = "createTime"
  }

  if (event.labelCur != undefined && event.labelCur != "") {
    where.labelCur = event.labelCur - 1
  }

  return cloud.database().collection('bookInformation').where(where)
    .orderBy(event.orderBy, 'desc').get({
      success(res) {
        return res
      },
      fail(err) {
        return err
      }
    })
}