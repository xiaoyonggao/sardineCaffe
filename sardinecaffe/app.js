import {
  fetchApi,
  setStorageSync,
  getStorageSync,
  toUnicode,
  error,
  removeStorage
} from './utils/util.js'
import md5 from './utils/md5.js'
App({
  onLaunch(options) {
    //获取关联普通二维码的码值，放到全局变量qrCode中
    if (options.query && options.query.qrCode) {
      that.globalData.qrCode = options.query.qrCode;
      console.log("options.query", options.query)
    }
    var res = my.getSystemInfoSync();
    if (res.model.includes("iPhone X")) {
      this.globalData.iPhonex = '64rpx'
    }
    // this.authUser()
  },
  authUser: function(loginSuc) {
    var that = this;
    // 获取用户信息
    my.getAuthCode({
      scopes: 'auth_user',
      success: res => {
        fetchApi({
          url: 'User/getAccess_token',
          data: {
            code: res.authCode,
          }
        }, res => {
          if (res.data.status == 1) {
            setStorageSync('userData', res.data.data);
            setStorageSync('openid', res.data.data.openid);
            if (that.loginSuc) {
              that.loginSuc(res);
            }
          }
        })
      },
      fail: res => {
        if (this.userInfoNotReadyCallback) {
          this.userInfoNotReadyCallback(res)
        }
      }
    });
  },
  openDoor: function(uid, vmc, succ, aliLoginCallback) {
    if (!vmc) {
      error(res.data.message);
    }
    fetchApi({
      url: 'Citybox/opendoor',
      data: {
        uid: uid,
        vmc: vmc,
        origin: 'ali'
      },
      isNotLoading: 1
    }, function(res) {
      succ(res);
    }, function(res) {
      aliLoginCallback() && aliLoginCallback(vmc)
    })
  },

  scanCode: function(orgLightfoodcard) {
    console.log("orgLightfoodcard",orgLightfoodcard)
    var that = this
    my.scan({
      type: 'qr',
      success: (res) => {
        var splits = res.code.split("=")
          console.log("res11122",splits[0])
        if (splits[0].trim() == 'http://www.sardinecaffe.com/?scene') {
          var params = splits[1].split("_");
        
          if (params.length == 2) {
            if (params[0] == 'coffee') {
              if (orgLightfoodcard) {
                  error("请扫描轻食机二维码");
              } else {
                my.navigateTo({
                  url: '../caffeList/caffeList?vmcId=' + params[1]
                })
              }
            } else if (params[0] == 'citybox') {
              my.navigateTo({
                url: '../open/open?vmcId=' + params[1]
              });
            }
          } else {
            error('请扫描正确的二维码');
            return;
          }
        } else {
          error('未识别设备号')
          return;
        }
      },
      fail: (res) => {
        console.log('扫码失败');
      }
    })
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
  //获取用户信息
  getUserlist(uid, succ) {
    fetchApi({
      url: 'User/getUserInfo',
      data: {
        uid: uid,
        touid: uid
      },
      isNotLoading:true
    }, res => {
      succ(res)
    })
  },
  getParaAndSign(uid,vmcId) {
    var that = this
    var vmcId = vmcId
    fetchApi({
      url: 'Citybox/entrust',
      data: {
        uid: uid,
        origin: 'ali'
      }
    }, res => {
      var data = res.data.data;
      that.sign(data,vmcId);
    })
  },
  sign: function(data,vmcId) {
    my.paySignCenter({
      signStr: data,
      success: (res) => {
        //签约失败
        console.log("签约返回的信息", res.resultStatus)
        var erroCode = res.resultStatus;
        if (erroCode == '7002' || erroCode == '6001' || erroCode == '6002') {
          this.globalData.qrCode = null
        }else{
          this.globalData.qrCode = 1
        }
        console.log("签约后跳首页参数",vmcId)
        my.reLaunch({
          url: '/pages/home/home?vmcId='+ vmcId
        });
      },
      fail: (res2) => {
        console.log("失败fail", res2)
        my.alert({
          title: 'fail', // alert框的标题
          content: '签约失败',
          buttonText: '我知道了',
          success: () => {
            my.reLaunch({
              url: '/pages/home/home'
            });
          },
        });
      }
    });
  },
  globalData: {
    iPhonex: '',
    qrCode: ''
  },
  //md5加密
  md5(str) {
    return md5.md5(str)
  },
   //获取咖啡券列表
  getCard(_type,uid,suc) {
    fetchApi({
      url: 'Card/getCardlist',
      data: {
        uid: uid,
       type: _type,
      pagenum: 1,
      pagesize: 9999
      }
    }, res => {
      suc && suc(res)
    })
  }
});
