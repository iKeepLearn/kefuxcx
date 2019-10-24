const cloud = require('wx-server-sdk')
cloud.init({
  env: 'kefu-714hv'
})
const db = cloud.database()
exports.main = async(event, context) => {
  let store = event.store
  let _id = store._id
  delete store._id

  let result = await db.collection('store').doc(_id).update({
    data: store
  })

  return {
    result,
    event
  }
}