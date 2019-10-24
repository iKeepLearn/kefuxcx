// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'kefu-714hv'
})
const db = cloud.database()
const service = db.collection('admin')
const alert = db.collection('store')


// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var result = null
  let method = event.method
  try {
    switch (method) {
      case 'get':
        result = await service
          .get()
        break;
      case 'update':
        let updateopenid = event.openid
        let storeid = event.storeid
        result = await alert.doc(
          storeid
        ).update({
          data: {
            admin: updateopenid
          }
        })
        break;
      case 'delete':
        let docid = event.docid
        let deleteopenid = event.openid
        await service.doc(docid)
          .remove()

        result = await db.collection('userState').where({
          openId: deleteopenid
        }).update({
          data: {
            service: 0
          }
        })
        break;
      case 'add':
        let addopenid = event.openid
        await service.add({
          data: {
            openid:addopenid
          }
        })
        result = await db.collection('userState').where({
          openId: addopenid
        }).update({
          data: {
            service: 1
          }
        })
        break;
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