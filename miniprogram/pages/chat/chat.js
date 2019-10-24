const app = getApp()
const util = require('../../utils/mall')
const isAdmin = require('../../utils/isAdmin')
const formatDate = require('../../utils/util')
const db = wx.cloud.database()
const record = wx.getRecorderManager()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    InputBottom: 0,
    mallBottom: 50,
    sound: false,
    admin: 0,
    msgText: '',
  },

  onLoad: function(e) {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })

    }).catch(err => {
      console.log('Not Authenticated yet');
    })
    isAdmin(this)

    if (e.id) {
      this.setData({
        queryId: e.id,
        customerOpenId: e.id
      })
    }
    this.getStore()
    db.collection('reply').get()
      .then(res => {
        this.setData({
          reply: res.data
        })
      })
  },

  selectReply(e) {
    this.setData({
      modalName: 'reply'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  reply(e) {
    let text = e.currentTarget.dataset.text
    this.setData({
      msgText: text
    })
    this.hideModal()
  },
  goReply() {
    wx.navigateTo({
      url: '/pages/reply/reply',
    })
  },

  getStore() {
    db.collection('store').get()
      .then(res => {
        let store = res.data[0]
        this.setData({
          store
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
  

  clearMsg() {
    let id = this.data.customerOpenId
    wx.cloud.callFunction({
      name: 'clearMsg',
      data: {
        id
      }
    }).then(res => {
      if (res.result) {
        wx.showToast({
          title: '清除成功',
        })
      } else {
        wx.showToast({
          title: '管理员才能删',
          image: '/images/alert.png'
        })
      }
    })
  },

  handleTap(e) {
    let msg = e.currentTarget.dataset.msg
    switch (msg.type) {
      case 1:
        wx.setClipboardData({
          data: msg.value,
          success(res) {
            wx.getClipboardData({
              success(res) {
                wx.showToast({
                  title: '已复制',
                })

              }
            })
          }
        });
        break;
      case 2:
        wx.previewImage({
          urls: [msg.value],
        })
        break;
      case 3:
        this.playAudio(msg.value)

    }
  },
  playAudio(e) {
    let audio = wx.createInnerAudioContext()
    audio.autoplay = true
    audio.src = e
    audio.play()
    audio.onPlay(() => {
      console.log('playing')
    })
  },


  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },
  inputMethod() {
    let sound = this.data.sound
    this.setData({
      sound: !sound
    })
  },
  

  selectPic(e) {
    let _this = this
    let name = e.currentTarget.dataset.name
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        for (let item in res.tempFilePaths) {
          let rString = _this.randomString(18, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
          let name = 'images/' + rString + '.jpg'
          let path = res.tempFilePaths[item]
          this.upload({
            name,
            path,
            'type': 2,
          })
        }
      }
    });
  },

  randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result;
  },
  upload(...args) {
    let args1 = {
      ...args
    }
    let name = args1[0].name
    let path = args1[0].path
    let type = args1[0].type
    let duration = args1[0].duration ? args1[0].duration : ''
    wx.cloud.uploadFile({
        cloudPath: name,
        filePath: path,
      })
      .then(res => {
        let value = res.fileID
        this.setData({
          cloudFileId: res.fileID
        })
        this.sendMsg({
          value,
          type,
          duration
        })
      }).catch(error => {
        console.log(error)
      })
  },
  startRecord(e) {
    wx.showLoading({
      title: '松开发送',
      image: '/images/record.png'
    })

    record.start({
      format: 'mp3'
    })
    record.onStop(function(res) {
      console.log(res)
    })

  },

  endRecord(e) {

    let _this = this
    wx.hideLoading()
    record.stop()
    record.onStop(function(res) {
      let rString = _this.randomString(18, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      let name = 'record/' + rString + '.mp3'
      let path = res.tempFilePath
      let duration = res.duration
      _this.upload({
        name,
        path,
        'type': 3,
        duration
      })
    })

  },
  sendMsgText(e) {
    let value = e.detail.value.msgText
    let formId = e.detail.formId
    let type = 1
    if (!value) {
      wx.showToast({
        title: '消息为空',
        image: '/images/alert.png'
      })
    } else {
      this.sendMsg({
        value,
        type,
        formId,
      })
    }
    this.setData({
      msgText: '',
      msgbottom: this.data.msgbottom + 200
    })
  },
  sendMsg({ ...args
  }) {
    let _this = this

    let args1 = {
      ...args
    }

    let customerOpenId = this.data.customerOpenId
    let adminOpenId = this.data.adminOpenId
    let nickName = this.data.userInfo.nickName
    let avatarUrl = this.data.userInfo.avatarUrl

    let admin = this.data.admin
    let fk = {
      customerOpenId,
      adminOpenId,
      nickName,
      avatarUrl,
      admin
    }

    let data = Object.assign(args1, fk)
    wx.cloud.callFunction({
      name: 'sendMsg',
      data: data
    }).then(res => {

    })

  },

  onShow() {
    let userInfo = this.data.userInfo
    formatDate.updateState(1, userInfo)
    this.monitorMsg()
  },

  async monitorMsg() {
    let self = this
    let id = this.data.queryId
    await db.collection('msg').where({
      customerOpenId: id
    }).watch({
      onChange: (res) => {
        let msg = res.docs
        let msgIndex = []
        for (let item in msg) {
          let date = new Date(msg[item].createTime)
          let sendTime = formatDate.formatTime(date)
          msg[item].createTime = sendTime
          msgIndex.push(`msg${item}`)
        }
        this.setData({
          msg: msg,
          scrollBottom: msgIndex[msgIndex.length - 1]
        })
      },
      onError: (err) => {
        console.error(err)
      }
    })
  },

  onUnload() {
    let userinfo = this.data.userInfo
    formatDate.updateState(0, userinfo)
  }
})