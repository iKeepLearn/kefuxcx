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
  let form = event
  form.createTime = createTime
  let nickName = form.nickName

  form.openid = openid

  let id = form.customerOpenId

  if (form.admin) {
    var toUser = form.customerOpenId
  } else {
    let res = await db.collection('store').get()
    var toUser = res.data[0].admin
  }
  delete form.userInfo
  delete form.admin

  await db.collection('msg').add({
    data: form
  })


  try {
    if (form.formId) {
      var formId = form.formId
      await db.collection('formId').add({
        data: {
          formId: formId,
          createTime: createTime,
          _openid:openid
        }
      })

      await cloud.callFunction({
        name: 'sendTempMsg',
        data: {
          nickName,
          toUser,
          id
        }
      })

    }

    return {
      event,
      toUser,
      formId
    }

  } catch (err) {
    return {
      err,
      event,
      form,
      toUser
    }
  }
}