
function isAdmin(e) {
  wx.cloud.callFunction({
    name: 'isAdmin'
  }).then(res => {
    isAdmin = res.result.isAdmin
    let currentOpenId = res.result.currentOpenId
    e.setData({
      currentOpenId,
      admin: isAdmin
    })
    let adminId = res.result.admin[0]
    if (isAdmin) {
      let adminOpenId = res.result.openid
      e.setData({
        adminOpenId
      })
    } else {
      let customerOpenId = res.result.openid
      e.setData({
        customerOpenId,
        adminOpenId:adminId
      })
    }
  })
  return isAdmin
}
module.exports = isAdmin