import {
  fetchApi,
  setStorageSync,
  getStorageSync,
  toUnicode,
  error,
  removeStorage
} from './utils/util.js'
App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    var res = my.getSystemInfoSync();
    if (res.model.includes("iPhone X")) {
      this.globalData.iPhonex = '64rpx'
    }
    console.info('App onLaunch');
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
  globalData: {
    iPhonex: ''
  }
});
