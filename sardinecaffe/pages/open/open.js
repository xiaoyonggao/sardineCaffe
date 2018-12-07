import {
  fetchApi,
  getStorageSync,
} from '../../utils/util.js';
const app = getApp()
var uid = '', vmcId = '', _userData = '', optionTmp = {},  timerimg = null;
Page({
  data: {
    isLogin: 0,
    vmcId: '',
    orderid: '',
    flag: false,
    countShow: false,
    cardList: []
  },
  onLoad(options) {
    optionTmp = options;
    console.log("签约返回",optionTmp)
    var t = this, _userData = getStorageSync('userData') || '';
    uid = _userData.id || ''
    vmcId = options.vmcId || ''
    t.setData({
      vmcId: options.vmcId,
      orderid: options.orderid,
      flag: true
    })
    app.loginSuc = res => {
      t.onLoad(optionTmp);
    }
    if (uid) {
      t.setData({
        isLogin: 0
      });
      if (app.globalData.qrCode) {
        // from_url = decodeURIComponent(app.globalData.qrCode);
        // var splits = from_url.split("p.html?d=");
        // if (splits.length == 2) {
        //   deviceId = splits[1].split("&")[0];
        // }
        t.openlock(t, uid, vmcId)
        return
      }
      if (vmcId) {
        t.openlock(t, uid, vmcId)
      }
    } else {
      t.setData({
        isLogin: 1
      });
    }
  },
  openlock(t, uid, vmcId) {
    if (vmcId) {
      app.openDoor(uid, vmcId,
        function(res) {
          t.open_succ(res)
        })
    } else {
      my.redirectTo({
        url: '/pages/home/home'
      });
    }
  },
  open_succ: function(res) {
    console.log("打印开门", res);
    var t = this;
    if (res.data.status == 0) {
      app.globalData.qrCode = null
      my.alert({
        title: '提示',
        content: res.data.msg,
        confirmText: '我知道了',
        success: function(res) {
          if (res.confirm) {
            my.reLaunch({
              url: '../home/home'
            })
          }
        }
      })
    } else if (res.data.status == 1) {
      console.log("res.data.status== 1")
      app.globalData.qrCode = null
      if (res.data.data) {
        var orderid = res.data.data.orderid
        t.setData({
          orderid:orderid
        })
        t.getBoxStatus()
      }
    } else if (res.data.status == 2) {
      console.log("")
      console.log("res.data.status== 2免密签约", res.data.status)
      app.getParaAndSign(uid,vmcId)
    }
  },
  //查询机器状态
  getBoxStatus() {
    var t = this;
    clearInterval(timerimg);
    fetchApi({
      url: 'Citybox/getBoxStatus',
      data: {
        uid: uid,
        vmc: t.data.vmcId,
        orderid: t.data.orderid
      },
      isNotLoading:true
    }, res => {
      console.log("getBoxStatus",res)
      if (res.data.status == 1) {
        var orderdetail = JSON.stringify(res.data)
        clearInterval(timerimg);
        my.vibrateLong();
        my.reLaunch({
          url: '../ctiyaccount/ctiyaccount?total=' + res.data.total + '&orderdetail=' + orderdetail,
        })
      } else if (res.data.status == 2) {
        t.setData({
          countShow: true
        })
      }
    }, res => {
      clearInterval(timerimg);
      setTimeout(() => {
        my.reLaunch({
          url: '../home/home',
        })
      }, 2000)
    })
    timerimg = setInterval(function() {
      t.getBoxStatus();
    }, 2000)
  },
});
