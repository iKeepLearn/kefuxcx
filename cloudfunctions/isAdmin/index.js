const cloud = require('wx-server-sdk')
cloud.init({
  env: 'kefu-714hv'
})
const db = cloud.database()
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()



  let adminList = null
  await db.collection('admin').get().then(res => {
    adminList = res.data
  })

  let admin = []

  for (let item in adminList) {
    admin.push(adminList[item].openid)
  }
  var openid = wxContext.OPENID
  if (event.id) {
    openid = event.id
  }
  

  let currentOpenId = wxContext.OPENID

  let isAdmin = 0

  if (admin.indexOf(openid) != -1) {
    isAdmin = 1
  }

  return {
    event,
    isAdmin,
    currentOpenId,
    openid,
    admin
  }
}