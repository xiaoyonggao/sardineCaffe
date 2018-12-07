import {
  fetchApi,
  getStorageSync,
  checkMobile
} from '../../utils/util.js';
const app = getApp()
var _uid = '', timer = null, CountDown = 59, pages = '';
Page({
  data: {
    userJson: '',
    codeTitle: '获取验证码',
    oldPhone: '',
    phone: '',
    code: '',
    myUid: '',
    codeNum: '',
    off: true,
    isIpx: ''
  },
  getCodeNum: function() {
    var t = this;
    if (t.data.off) {
      if (!checkMobile(this.data.phone)) {
        my.alert({
          title: '提示',
          content: '手机号不正确',
          success: function(res) {
            return;
          }
        });
      } else {
        if (this.data.phone == this.data.oldPhone) {
          my.alert({
            title: '提示',
            content: '手机号与当前绑定的相同',
            success: function(res) {
              return;
            }
          });
          return
        }
        fetchApi({
          url: 'User/sendUserSms',
          data: {
            mobile: t.data.oldPhone,
            type: 1
          }
        }, res => {
          if (res.data.status == 1) {
            t.setData({
              codeNum: res.data.data.code,
              off: false,
              codeTitle: CountDown + 'S'
            });
            timer = setInterval(function() {
              if (CountDown == 0) {
                t.setData({
                  codeTitle: '获取验证码',
                  off: true
                });
                CountDown = 59
                clearInterval(timer)
              } else {
                t.setData({
                  codeTitle: CountDown + 'S'
                });
                CountDown--;
              }
            }, 1000);
          } else {
            my.alert({
              title: '提示',
              content: res.data.msg,
              success: function(res) {
                return;
              }
            });
          }
        })



      }
    }
  },
  saveFn() {
    var t = this;
    if (!checkMobile(this.data.phone)) {
      my.alert({
        title: '提示',
        content: '手机号不正确',
        success: function(res) {
          return;
        }
      });
      return
    }
    if (this.data.code == '' || this.data.codeNum != app.md5(this.data.code)) {
      my.alert({
        title: '提示',
        content: '验证码不正确',
        success: function(res) {
          return;
        }
      });
    } else {
      fetchApi({
        url: 'User/upUserInfo',
        data: {
          uid: _uid,
          mobile: t.data.phone
        }
      }, res => {
        my.alert({
          title: '提示',
          content: '新手机号绑定成功',
          success: function(res) {
            pages[pages.length - 2]._updata()
            my.navigateBack({
              delta: 1
            })
          }
        });
      })
    }
  },
  phoneFn(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  codeFn(e) {
    this.setData({
      code: e.detail.value
    })
  },
  onLoad() {
    var userData = getStorageSync('userData'), t = this;
    _uid = userData.id;
    pages = getCurrentPages()
    this.setData({
      myUid: _uid,
      oldPhone: userData.mobile,
      isIpx: app.globalData.isIpx ? true : false
    });
    app.getUserlist(_uid, function(res) {
      if (res.data.status == 1) {
        t.setData({
          userJson: res.data.data
        })
      }
    })

  },

})
