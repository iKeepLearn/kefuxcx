// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'kefu-714hv'
})
const db = cloud.database()


// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID

  var queryid = event.id

  let admin = await cloud.callFunction({
    name: 'isAdmin',
    data: {
      id: openid
    }
  })

  let isAdmin = admin.result.isAdmin

  if (isAdmin) {

    let result = await db.collection('msg')
      .where({
        customerOpenId: queryid
      })
      .remove()

    return {
      event,
      result
    }
  } else {
    return 0
  }
}