import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js'
//获取应用实例
const app = getApp();
var _uid = ''
Page({
  data: {
    currentPage: 2,
    isIpx: ''
  },

  onLoad() {
    var t = this
    var userData = getStorageSync('userData');
    _uid = userData.id;
    this.setData({
      isIpx: app.globalData.isIpx ? true : false,
    })
    t.getUserlist()
  },
  getUserlist() {
    var t = this
    app.getUserlist(_uid, function(res) {
      t.setData({
        userJson: res.data.data
      });
    });
  },
  onReady() {
    // 页面加载完成
    this.setData({
      isIpx: app.globalData.iPhonex
    })
  },
  makePhoneCall(e) {
    my.makePhoneCall({
      number: e.currentTarget.dataset.phone
    })
  },
  onShow() {
    // if (_uid) this.getUserlist()
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
  }
});
