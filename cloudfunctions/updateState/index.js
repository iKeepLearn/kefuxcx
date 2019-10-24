// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'kefu-714hv'
})
const db = cloud.database()
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  let state = event.state * 1
  let userInfo = event.userinfo
  let updateTime = new Date()

  try {
    const stateRes = await db.collection('userState').where({
      openId
    }).get()
    const stateOld = stateRes.data

    if (!stateOld.length) {
      let result = await db.collection('userState').add({
        data: {
          openId:openId,
          state: state,
          userInfo:userInfo,
          updateTime:updateTime
        },
      })
    } else {
      let result = await db.collection('userState').where({
        openId
      }).update({
        data: {
          state:state,
          userInfo: userInfo,
          updateTime:updateTime
        }
      })
    }
    return {
      event,
      result
    }
  } catch (err) {
    return {
      event,
      err
    }

  }
}