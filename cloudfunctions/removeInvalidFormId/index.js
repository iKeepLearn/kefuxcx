// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'kefu-714hv'
})
const db = cloud.database()


// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = db.command
  const currentDate = new Date()
  const stamp = currentDate.setDate(currentDate.getDate() - 7) //获取前7天的时间戳
  const date = new Date(stamp); //转化为日期
  let result = await db.collection('formId')
    .where({
      createTime: _.lt(date)
    }).remove()
  return {
    result
  }
}