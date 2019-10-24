const cloud = require('wx-server-sdk')
cloud.init({
  env: 'kefu-714hv'
})
const db = cloud.database()

exports.main = async (event, context) => {

  const nickName = event.nickName
  const toUser = event.toUser
  const id = event.id
  const page = `/pages/chat/chat?id=${id}`

  try {
    var adminID = await db.collection('formId')
      .where({
        _openid: toUser
      })
      .orderBy('createTime', 'asc')
      .limit(1)
      .get()

    var msgFormId = adminID.data[0].formId


    let stateRes = await db.collection('userState').where({
      openId: toUser
    }).get()
    const state = stateRes.data[0].state
    if (!state) {

      if (msgFormId) {
        
        const admin = await cloud.openapi.templateMessage.send({
          touser: toUser,
          page: page,
          data: {
            keyword1: {
              value: '有新消息'
            },
            keyword2: {
              value: nickName
            },
          },
          templateId: 'RhuENzTonl_sekpz5TEYY_XpvElVG5R1ZykYsBqtYFY',
          formId: msgFormId
        })

        await db.collection('formId').where({
          formId: msgFormId
        }).remove()


        return {
          admin,
          event,
          page
        }
      }
    } else {
      return 'User are onLine'
    }
  } catch (err) {
    return {
      err,
      event,
      adminID,
      msgFormId
    }
  }
}