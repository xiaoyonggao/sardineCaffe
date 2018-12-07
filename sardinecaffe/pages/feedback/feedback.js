import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
const app = getApp()
var _uid = '';
Page({
  data: {
    contentVal: ''
  },
  onLoad() {
    var userData = getStorageSync('userData');
    _uid = userData.id;
  },
  changeVal(e) {
    this.setData({
      contentVal: e.detail.value
    })
  },
  sendFn() {
    if (this.data.contentVal == '') {
      my.alert({
        title: '亲',
        content: '没有输入内容~~',
        buttonText: '我知道了',
        success: () => {
        },
      });
      return
    }
    var t = this;
    fetchApi({
      url: 'Common/postFeedback',
      data: {
        uid: _uid,
        content: t.data.contentVal
      }
    }, res => {
      my.alert({
        title: '亲',
        content: '没有输入内容~~',
        buttonText: '我知道了',
        success: () => {
          my.navigateBack({
            delta: 1
          })
        },
      });
    }, res2 => {
      console.log(res2)
    })

  }
})
