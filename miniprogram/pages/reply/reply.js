const db = wx.cloud.database()
const reply = db.collection('reply')
Page({
  data: {
    add: false
  },

  onLoad: function(options) {
    this.getReply()
  },

  getReply() {
    reply
      .get()
      .then(res => {
        var edit = []
        for (let item in res.data) {
          edit.push('true')
        }
        this.setData({
          reply: res.data,
          edit
        })
      })
  },

  deleteReply(e) {
    let id = e.currentTarget.dataset.id
    reply.doc(id).remove().then(res => {
      this.getReply()
    })
  },

  editReply(e) {
    let module = e.currentTarget.dataset.module
    let index = e.currentTarget.dataset.index
    let data = `${module}[${index}]`
    this.setData({
      [data]: true
    })
    let text = e.detail.value
    let id = e.currentTarget.dataset.id
    reply.doc(id).update({
      data: {
        text
      }
    }).then(res => {
      this.getReply()
    })

  },
  goAdd() {
    this.setData({
      add: true
    })
  },
  addReply(e) {
    if (this.data.reply.length == 10) {
      wx.showToast({
        title: '最多10条',
        image: '/images/alert.png'
      })
      this.setData({
        add: false
      })
    } else {
      let text = e.detail.value
      if (text) {
        reply.add({
          data: {
            text
          }
        }).then(res => {
          this.setData({
            add: false
          })
          this.getReply()
        })
      } else {
        this.setData({
          add: false
        })
      }
    }
  },
  goEdit(e) {
    let module = e.currentTarget.dataset.module
    let index = e.currentTarget.dataset.index
    let data = `${module}[${index}]`
    this.setData({
      [data]: false
    })
  }
})