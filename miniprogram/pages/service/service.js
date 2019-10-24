const db = wx.cloud.database()
const service = db.collection('admin')
Page({
  data: {
    add: false
  },

  onLoad: function(options) {
    this.initData()

  },

  initData() {
    this.getservice()
    
    db.collection('userState').orderBy('updateTime', 'desc').get().then(res => {
      let user = {}
      for (let item in res.data) {
        let userinfo = res.data[item].userInfo
        let openid = res.data[item].openId
        user[openid] = userinfo
        user[openid].openid = openid
        user[openid].service = res.data[item].service
      }
      this.setData({
        user
      })
    })

    db.collection('store').get().then(res => {
      this.setData({
        store: res.data[0]
      })
    })

  },

  getservice() {
    wx.cloud.callFunction({
      name: 'service',
      data: ({
        method: 'get'
      })
    }).then(res => {
      let service = res.result.result.data
      this.setData({
        service
      })
      return service
    })
  },

  deleteservice(e) {
    let docid = e.currentTarget.dataset.docid
    let openid = e.currentTarget.dataset.openid
    wx.showLoading({
      title: '正在删除...',
      mask:true,
      image:'/images/alert.png'
    })
    wx.cloud.callFunction({
      name: 'service',
      data: ({
        method: 'delete',
        docid,
        openid
      })
    }).then(res => {
      this.initData()
      wx.hideLoading()
    })
  },

  changeService(e) {
    let id = e.detail.value
    this.updateService(id, 'update')
  },

  updateService(openid) {
    let storeid = this.data.store._id
    wx.cloud.callFunction({
      name: 'service',
      data: ({
        method: 'update',
        openid,
        storeid
      })
    }).then(res => {
      this.initData()
    })

  },

  change(e) {
    this.setData({
      modalName: 'service'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
    this.initData()
  },
  addService(e) {
    wx.showLoading({
      title: '正在添加...',
      mask:true
    })
    let openid = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'service',
      data: ({
        method: 'add',
        openid
      })
    }).then(res => {
      this.initData()
      wx.hideLoading()
    })
  },
 
})