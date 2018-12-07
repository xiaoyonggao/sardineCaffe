import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
const app = getApp()
var _uid = '',pages ='';
Page({
  data: {
    myUid: '',
    dataList: ''
  },
  onShow() {
  },
  onLoad() {
    var userData = getStorageSync('userData');
    _uid = userData.id;
    pages = getCurrentPages();
    this.getMyMsgNums();
  },
  getMyMsgNums() {
    var t = this;
    fetchApi({
      url: 'Common/getMyMsgNums',
      data: {
        uid: _uid
      }
    }, res => {
      console.log("hahahha222",res)
      t.setData({
        dataList: res.data.data || ''
      })
    },res2=>{
      console.log(res2)
    })
  },
   onUnload() {
    if(pages[pages.length-2].route == 'pages/userCenter/userCenter'){
      pages[pages.length-2].getMyMsgNums()
    }
  }
})
