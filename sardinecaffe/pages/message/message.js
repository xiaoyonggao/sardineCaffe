import {
  fetchApi
} from '../../utils/util.js';
const app = getApp()
var _uid = '';
Page({
  data: {
    myUid: '',
    dataList: ''
  },
  onShow() {
    if (_uid) this.getMyMsgNums();
  },
  onLoad() {
    // var userData = wx.getStorageSync('userData');
    // _uid = userData.id;
    this.getMyMsgNums();
  },
  getMyMsgNums() {
    var t = this;
    fetchApi({
      url: 'Common/getMyMsgNums',
      data: {
        uid: 5579
      }
    }, res => {
      t.setData({
        dataList: res.data.data || ''
      })
    },res2=>{
      console.log(res2)
    })
  }
})
