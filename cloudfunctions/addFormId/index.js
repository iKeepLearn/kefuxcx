// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'kefu-714hv'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const createTime = new Date()
  let formId = event.formId
  let result = await db.collection('formId').add({
    data: {
      formId: formId,
      createTime: createTime,
      openid: openid
    }
  })
  return {
    result
  }
}