const db = wx.cloud.database()
Page({
  data: {
    isChange: false,
    chooseAdd: false
  },

  onLoad: function() {
    wx.showLoading({
      title: '加载中...',
    })

    this.getStore()

  },
  getStore() {
    db.collection('store').get().then(res => {
      let store = res.data[0]
      this.setData({
        store
      })
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
    })
  },
  change() {
    this.setData({
      isChange: true
    })
  },

  cancel() {
    this.setData({
      isChange: false
    })
    this.getStore()
  },

  updateStore(e) {
    wx.showLoading({
      title: '更新信息...',
    })

    let fk = e.detail.value
    let store = this.data.store
    if (fk.time * 1000 != store.second) {
      fk.second = fk.time * 1000
      delete fk.time
    }

    let data = Object.assign(store, fk)
    wx.cloud.callFunction({
      name: 'updateStore',
      data: {
        store: data
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '店铺信息已更新',
      })
      this.setData({
        isChange: false,
        chooseAdd: false
      })
      this.getStore()
    })
  },

  changeAddress(e) {
    let store = this.data.store
    store.address = e.detail.value
    this.setData({
      store
    })
  },
  changeName(e) {
    let store = this.data.store
    store.name = e.detail.value
    this.setData({
      store
    })
  },
  changeTel(e) {
    let store = this.data.store
    store.tel = e.detail.value
    this.setData({
      store
    })
  },
  changeSecond(e) {
    let store = this.data.store
    let second = e.detail.value * 1000
    if (second <= 0) {
      wx.showToast({
        title: '至少1秒以上',
        image: '/images/alert.png'
      })

    } else {
      store.second = second
      this.setData({
        store
      })
    }
  },
  mapLocation(e) {
    let _this = this

    if (this.data.isChange) {
      wx.chooseLocation({
        success: function(res) {
          let store = _this.data.store
          store.address = res.address
          let latitude = res.latitude
          let longitude = res.longitude
          let geo = {
            'latitude': latitude,
            'longitude': longitude
          }
          store.geo = geo
          _this.setData({
            store,
            chooseAdd: true
          })
        },
        fail: function(res) {
          wx.showToast({
            title: '请打开位置授权',
            image: '/images/alert.png'
          })
          wx.openSetting({
            success(res) {
              console.log(res.authSetting)
            }
          })
        }
      })
    } else {
      let store = this.data.store
      let location = store.geo
      let name = store.name
      let address = store.address
      let latitude = location.latitude
      let longitude = location.longitude
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        name: name,
        address: address
      })
    }
  },

  onPullDownRefresh: function() {
    this.getStore()
    wx.stopPullDownRefresh()
  },

})