import {
  fetchApi,
  setStorageSync
} from '../../utils/util.js'
//获取应用实例
const app = getApp();
Page({
  data: {
    currentPage:2,
    isIpx:''
  },

  onLoad() {
    // var count = my.getStorageSync('shopCountSize')
    // var userData = my.getStorageSync('userData');
    // _uid = userData.id;
    this.setData({
      isIpx: app.globalData.isIpx ? true : false,
    })
    this.getUserlist();
  },
  onReady() {
    // 页面加载完成
    this.setData({
      isIpx: app.globalData.iPhonex
    })
  },
  //获取用户信息
  getUserlist() {
    var t = this
    fetchApi({
      url: 'User/getUserInfo',
      data: {
        uid: 5579,
        touid: 5579
      }
    },res=>{
      console.log("resresresres",res)
      setStorageSync('currentNum', res.data.data.coffee_nums);
      t.setData({
        userJson: res.data.data
      });
    },res2=>{
      console.log(res2)
    })
  },
  makePhoneCall: function(e) {
    my.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  makePhoneCall: function(e) {
    my.makePhoneCall({
      phoneNumber: e.target.dataset.phone
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
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  }
});
