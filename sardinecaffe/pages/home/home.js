import {
  fetchApi
} from '../../utils/util.js';
//获取应用实例
const app = getApp();
Page({
  data:{
    isIpx: '',
    currentPage:1,
    bannerArr:'',
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    xcx_index_goods:""
  },
  onLoad(opt) {
    var that = this
    // 页面加载
    fetchApi({
      url:'Common/indexInfo',
      data:{}
    },res =>{
      that.setData({
        bannerArr: res.data.data.xcx_index || [],
        xcx_index_goods: res.data.data.xcx_index_goods || [],
        // xcx_index_merchant: res.data.data.xcx_index_merchant,
      });
     },res2 =>{
      console.log(res2)
    })
    
  },
  onReady() {
    // 页面加载完成
    this.setData({
      isIpx: app.globalData.iPhonex
    })
  },
  onShow() {
    // 页面显示
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
