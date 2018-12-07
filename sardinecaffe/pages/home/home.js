import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
//获取应用实例
const app = getApp();
var uid = ''
Page({
  data: {
    isIpx: '',
    currentPage: 1,
    bannerArr: '',
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    xcx_index_goods: "",
    userData: '',
    coffee_nums: '',
    isLogin: 0
  },
  onLoad(opt) {
    console.log("opt",opt)
    // if()
    //  var res = my.getSystemInfoSync();
    //  console.log("res.model",res.model)
    // if (res.model.includes("iPhone X")) {
    //   app.globalData.iPhonex = '64rpx'
    // }else{
    //   app.globalData.iPhonex = '0rpx'
    // }
    var that = this, _userData = getStorageSync('userData') || '';
    uid = _userData.id
    app.loginSuc = res => {
      that.onLoad();
    }
    if (app.globalData.qrCode) {
      console.log("有全局变量嘛",app.globalData.qrCode)
      if(opt.vmcId){
        console.log("opt.vmcId",opt.vmcId)
       my.redirectTo({
        url: '/pages/open/open?vmcId='+ opt.vmcId
      });
      }
    //  return
    }
    if (uid) {
      this.setData({
        isLogin: 0,
      });
      this._getIndexInfo()
    } else {
      this.setData({
        isLogin: 1
      });
    }
  },
  _getIndexInfo() {
    var that = this
    fetchApi({
      url: 'Common/indexInfo',
      data: {}
    }, res => {
      var xcx_index = res.data.data.xcx_index.filter(item => {
        return item.type != 2
      })
      that.setData({
        bannerArr: xcx_index,
        xcx_index_goods: res.data.data.xcx_index_goods || [],
        // xcx_index_merchant: res.data.data.xcx_index_merchant,
      });
    })
    that.getUserlist()
  },
  getUserlist() {
    console.log("执行")
    var that = this
    app.getUserlist(uid, function(res) {
      my.hideLoading();
      that.setData({
        coffee_nums: res.data.data.coffee_nums
      })
    })
  },
  onReady() {
    // 页面加载完成
    this.setData({
      isIpx: app.globalData.iPhonex
    })
  },


  onShow() {
   var mkId = getStorageSync('makeingId');
    var makeingCaffeName = getStorageSync('makeingCaffeName');
    if (mkId) {
      this.setData({
        makingName: makeingCaffeName,
        showMaking: true
      });
    }
    this.getUserlist()
  },
  //点击进入咖啡详情
  making_caffe() {
    my.navigateTo({
      url: '/pages/making/making'
    })
  },
  onHide() {
    // 页面隐藏
    console.log(" // 页面隐藏")
  },
  onUnload() {
    // 页面被关闭
    console.log(" // 页面被关闭")
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  }
});
