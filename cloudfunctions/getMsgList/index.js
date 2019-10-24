// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'kefu-714hv'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const _ = db.command.aggregate
  let res = await db.collection('msg').aggregate()
    .group({
      _id: "$customerOpenId",
      nickName: _.first("$nickName"),
      avatarUrl: _.first("$avatarUrl"),
      type: _.last("$type"),
      value: _.last("$value"),
      customerOpenId: _.last("$customerOpenId"),
      createTime: _.last("$createTime"),
    })
    .sort({
      "createTime": -1
    })
    .end()
    
    let result = res.list
  return {
    result
  }
}