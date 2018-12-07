import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
const app = getApp()
var _uid = '', tipOff = '',pages='';
Page({
  data: {
    myUid: '',
    showOff: false,
    dataList: '',
    source: ''
  },
  onShow() {
    // if (_uid) this.getSysMsg();
  },
  onLoad(opt) {
    tipOff = opt.tip || '';
    pages = getCurrentPages();
    if (opt.source == 1) {
      my.setNavigationBar({
        title: '咖啡券通知'
      })
    } else if (opt.source == 2) {
      my.setNavigationBar({
        title: '关注动态'
      })
    } else if (opt.source == 3) {
      my.setNavigationBar({
        title: '粉丝动态'
      })
    } else if (opt.source == 4) {
      my.setNavigationBar({
        title: '发布动态'
      })
    } else if (opt.source == 5) {
      my.setNavigationBar({
        title: '轻食券通知'
      })
    }
    var userData = getStorageSync('userData');
    _uid = userData.id;
    this.setData({
      source: opt.source
    })
    this.getSysMsg();
  },
  jumpUrl(e) {
    var t = this;
    fetchApi({
      url: 'Common/getSysMsgDetail',
      data: {
        uid: _uid,
        msgid: e.target.dataset.id
      }
    }, res => {
      if (t.data.source == 1 || t.data.source == 5) {
        my.navigateTo({
          url: '../caffeVoucher/caffeVoucher?source=' + t.data.source
        })
      } else if (t.data.source == 2) {
        my.navigateTo({
          url: '../userCommunity/userCommunity?touid=' + JSON.parse(e.target.dataset.touid).uid + '&isMe=0'
        })
      } else if (t.data.source == 3) {
        my.navigateTo({
          url: '../userCommunity/userCommunity?touid=' + JSON.parse(e.target.dataset.touid).uid + '&isMe=0'
        })
      } else if (t.data.source == 4) {
        if (tipOff) {
          my.navigateTo({
            url: '../messageInfo2/messageInfo2?touid=' + e.target.dataset.touid + '&isMe=1'
          })
        } else {
          my.navigateTo({
            url: '../userCommunity/userCommunity?touid=' + _uid + '&isMe=1'
          })
        }

      }
    }, res2 => {
      console.log(res2)
    })

  },
  getSysMsg() {
    var t = this;
    fetchApi({
      url: 'Common/getSysMsg',
      data: {
      uid: _uid,
      source: t.data.source,
      pagenum: 1,
      pagesize: 999
      }
    }, res => {
         t.setData({
        dataList: res.data.data || [],
        showOff: true
      })
    },res2=>{
       console.log(res2)
    })
  },
  onUnload() {
    if(pages[pages.length-2].route == 'pages/message/message'){
      pages[pages.length-2].getMyMsgNums()
    }
  }
})
