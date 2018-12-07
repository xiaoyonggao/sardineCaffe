import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
const app = getApp()
var _uid = '';
Page({
  data: {
    userJson: '',
    myUid: '',
    isIpx: '',
    backData: 0
  },
  onShow() {
    if (this.data.backData == 1) {
      this._updata()
    }
  },
  onLoad() {
    var t = this;
    var userData = getStorageSync('userData');
    _uid = userData.id;
    this.setData({
      myUid: _uid,
      isIpx: app.globalData.isIpx ? true : false,
    });
    this._updata()
  },
  onUnload() {
    this.setData({
      backData: 0
    })
  },
  _updata() {
    var t = this
    app.getUserlist(_uid, function(res) {
      if (res.data.status == 1) {
        t.setData({
          userJson: res.data.data
        })
      }
    })
  },
  // getUserlist() {
  //   var t = this;
  //   fetchApi({
  //     url: 'User/getUserInfo',
  //     data: {
  //       uid: _uid,
  //       touid:_uid
  //     }
  //   }, res => {
  //     if (res.data.status == 1) {
  //       t.setData({
  //         userJson: res.data.data
  //       })
  //       my.setStorageSync('userData', res.data.data);
  //     }
  //   },res2=>{
  //     console.log(res2)
  //   })
  // },
  removebind() {
    var t = this;
    my.confirm({
      title: '提示',
      content: '确定要解绑吗？',
      success: function(res) {
        if (res.confirm) {
          fetchApi({
            url: 'User/upUserInfo',
            data: {
              uid: _uid,
              type: 1,
              mobile: t.data.userJson.mobile
            }
          }, res => {
            if (res.data.status == 1) {
              my.showToast({
                content: '解绑成功',
                type: "success",
                duration: 2000,
              })
             t._updata()
            }
            else {
              my.showToast({
                content: '解绑失败,再试一次！',
                type: "none",
                duration: 2000,
              })
            }
          }, res2 => {
            console.log(res2)
          })
        } else {
          return;
        }
      }
    })
  }
})
