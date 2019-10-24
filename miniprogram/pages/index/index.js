//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/mall')
const isAdmin = require('../../utils/isAdmin')
const setPage = require('../../utils/setPage')
const formatDate = require('../../utils/util')
const db = wx.cloud.database()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    InputBottom: 0,
    userInfo: null,
  },

  onLoad: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    }).catch(err => {
      console.log('Not Authenticated yet');
    })
    setPage(this).then(res => {
      let admin = res.result.isAdmin
      if (!admin) {
        wx.redirectTo({
          url: '/pages/chat/chat',
        })
      } else {
        this.getMsg()
      }
    })

  },

  async getMsg() {
    await  wx.cloud.callFunction({
        name:'getMsgList'
      }).then(res => {
        let msg = res.result.result
        if (msg.length) {
          this.setData({
            hasMsg: true
          })
        } else {
          this.setData({
            hasMsg: false
          })
        }
        for (let item in msg) {
          let date = new Date(msg[item].createTime)
          let type = msg[item].type
          switch (type) {
            case 2:
              msg[item].value = '图片消息';
              break;
            case 3:
              msg[item].value = '语音消息';
              break;
          }
          let sendTime = formatDate.formatTime(date)
          msg[item].createTime = sendTime
        }
        this.setData({
          msg: msg
        })
      })
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReady() {
    wx.hideLoading()
  },
  goChat(e) {
    let id = e.currentTarget.dataset.id
    let url = `/pages/chat/chat?id=${id}`
    wx.navigateTo({
      url: url,
    })
  },
  onShareAppMessage() {

  },
  onPullDownRefresh() {
    this.getMsg()
    wx.stopPullDownRefresh()
  }

})