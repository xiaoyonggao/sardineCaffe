const app = getApp()
var _uid = '', tipOff = '';
Page({
  data: {
    myUid: '',
    showOff: false,
    dataList: '',
    source: ''
  },
  onShow() {
    if (_uid) this.getSysMsg();
  },
  onLoad(opt) {
    tipOff = opt.tip || ''
    if (opt.source == 1) {
      wx.setNavigationBarTitle({
        title: '咖啡券通知'
      })
    } else if (opt.source == 2) {
      wx.setNavigationBarTitle({
        title: '关注动态'
      })
    } else if (opt.source == 3) {
      wx.setNavigationBarTitle({
        title: '粉丝动态'
      })
    } else if (opt.source == 4) {
      wx.setNavigationBarTitle({
        title: '发布动态'
      })
    } else if (opt.source == 5) {
      wx.setNavigationBarTitle({
        title: '轻食券通知'
      })
    }
    var userData = wx.getStorageSync('userData');
    _uid = userData.id;
    this.setData({
      source: opt.source
    })
    this.getSysMsg();
  },
  jumpUrl(e) {
    var t = this;
    app.ajax(app.URL + 'Common/getSysMsgDetail', {
      uid: _uid,
      msgid: e.target.dataset.id
    }, function(res) {
      if (t.data.source == 1 || t.data.source == 5) {
        wx.navigateTo({
          url: '../caffeVoucher/caffeVoucher?source=' + t.data.source
        })
      } else if (t.data.source == 2) {
        wx.navigateTo({
          url: '../userCommunity/userCommunity?touid=' + JSON.parse(e.target.dataset.touid).uid + '&isMe=0'
        })
      } else if (t.data.source == 3) {
        wx.navigateTo({
          url: '../userCommunity/userCommunity?touid=' + JSON.parse(e.target.dataset.touid).uid + '&isMe=0'
        })
      } else if (t.data.source == 4) {
        if (tipOff) {
          wx.navigateTo({
            url: '../messageInfo2/messageInfo2?touid=' + e.target.dataset.touid + '&isMe=1'
          })
        } else {
          wx.navigateTo({
            url: '../userCommunity/userCommunity?touid=' + _uid + '&isMe=1'
          })
        }

      }
    })


  },
  getSysMsg() {
    var t = this;
    app.ajax(app.URL + 'Common/getSysMsg', {
      uid: _uid,
      source: t.data.source,
      pagenum: 1,
      pagesize: 999
    }, function(res) {
      console.log(res)
      t.setData({
        dataList: res.data.data || [],
        showOff: true
      })
    })
  }
})
