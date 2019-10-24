function setPage(e) {
  let admin = wx.cloud.callFunction({
    name: 'isAdmin'
   })
  return admin
}
module.exports = setPage