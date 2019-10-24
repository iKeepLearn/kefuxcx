//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/mall')
const isAdmin = require('../../utils/isAdmin')
const formatDate = require('../../utils/util')
const db = wx.cloud.database()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userInfo: null,
    buttonDisabled:false,
    formIdCount:'...'
  },

  onLoad: function() {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    }).catch(err => {
      console.log('Not Authenticated yet');
    })

    isAdmin(this)
    this.countId()
  },


  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  removeInvalidFormId() {
    wx.cloud.callFunction({
      name: 'removeInvalidFormId'
    }).then(res => {
      wx.showToast({
        title: '清理成功',
      })
    })
  },
 async addFormId(e){
   this.setData({
     buttonDisabled:true
   })
    let formId = e.detail.formId
    let createTime = new Date()
   db.collection('formId').add({
     data: {
       formId,
       createTime
     }
   }).then(res => {
     this.countId()
     this.setData({
       buttonDisabled: false
     })
   })
  },

  countId(){
   db.collection('formId').count().then(res =>{
      let formIdCount = res.total
      this.setData({
        formIdCount
      })
    })
  },
  
  onReady() {
    wx.hideLoading()
    setTimeout(() => {
      if (!this.data.admin) {
        wx.navigateTo({
          url: '/pages/chat/chat',
        })
      }
    }, 1000)
  },
  manageStore(e) {
    wx.navigateTo({
      url: '/pages/store/store',
    })
  },
  manageAdmin(e) {
    wx.navigateTo({
      url: '/pages/service/service',
    })
  },
  manageReply(e) {
    wx.navigateTo({
      url: '/pages/reply/reply',
    })
  },
  onPullDownRefresh() {
    this.onLoad()
    wx.stopPullDownRefresh()
  }
})