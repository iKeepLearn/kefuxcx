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
  if(event.id){
    openid = event.id
  }

  let result = await db.collection('msg')
    .where({
      customerOpenId: openid
    })
    .orderBy('createTime', 'asc')
    .get()

  return {
    event,
    result
  }
}