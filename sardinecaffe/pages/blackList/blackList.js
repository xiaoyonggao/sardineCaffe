import {
  fetchApi,
  getStorageSync,
} from '../../utils/util.js';
const app = getApp()
var _uid = '';
Page({
  data: {
    myUid: '',
    listArr: ''
  },
  onShow() {
    // if (_uid) this.getBlacklist()
  },
  onLoad() {
    var userData = getStorageSync('userData');
    _uid = userData.id;
    this.setData({
      myUid: _uid
    });
    this.getBlacklist()
  },
  delFn(e) {
    var t = this;
        fetchApi({
      url: 'User/doBlack',
      data: {
        uid: _uid,
        touid: e.target.dataset.uid,
        type: 0
      }
    }, res => {
      if (res.data.status) {
        t.getBlacklist()
      } else {
        my.showToast({
          content: res.msg,
        });
      }
    }, res2 => {
      console.log(res2)
    })
  },
  getBlacklist() {
    var t = this;
    fetchApi({
      url: 'User/getBlacklist',
      data: {
        uid: _uid,
      }
    }, res => {
      t.setData({
        listArr: res.data.data || []
      })
      console.log(222, res)
    }, res2 => {
      console.log(res2)
    })
  }
})
