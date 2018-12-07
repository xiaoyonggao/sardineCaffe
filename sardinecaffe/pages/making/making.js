import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
const app = getApp();
var timer = null,
  count = 0,
  uid = "",
  timer2 = null,
  _orderid = '';
Page({
  data: {
    stateArr: ['未支付', '拼命制作中', '制作已完成', '制作失败', '已退款'],
    stateNum: 0,
    uid: '',
    nowUser: '',
    enname: '',
    otherUser: '',
    imgSrc: '',
    stateWidth: 0,
    titleName: '',
    countDownNum: 5,
    showOff: false,
    Isclosemask: false
  },
  //监听页面卸载
  onUnload() {
    clearInterval(timer2);
  },
  getScanCode() {
    app.scanCode(1)
  },
  //查询产品制作状态
  getState() {
    var t = this;
    clearInterval(timer2);
    fetchApi({
      url: 'Coffee/getMakeStatus',
      data: {
        uid: uid,
        orderid: _orderid
      },
      isNotLoading: true
    }, argument => {
      console.log("查询产品制作状态", argument)
      t.setData({
        stateNum: argument.data.data.status,
        enname: argument.data.data.enname,
        imgSrc: argument.data.data.image,
        nowUser: argument.data.data.nowuinfo,
        otherUser: argument.data.data.userlist,
        titleName: argument.data.data.cnname,
        makestatus: argument.data.data.makestatus,
      });
      if (argument.data.data.status == 3) {
        clearInterval(timer2);
        my.vibrateLong();
        my.setStorageSync({
          key: 'makeingId',
          data: ''
        });
        my.alert({
          title: '提示',
          content: '制作失败，金额将在稍候退还。',
          success: function() {
            my.reLaunch({
              url: '../home/home'
            })
          }
        });
      };
      if (argument.data.data.status == 2) {
        clearInterval(timer2);
        my.vibrateLong();
        my.setStorageSync({
          key: 'makeingId',
          data: ''
        });
        setTimeout(function() {
          my.reLaunch({
            url: '../home/home'
          })
        }, 5000)
      }
    })

    timer2 = setInterval(function() {
      t.getState();
    }, 5000)
  },
  //关闭送券弹框
  closemask() {
    this.setData({
      Isclosemask: false
    })
  },
  onLoad(opt) {
    var t = this;
    console.log("接收参数", opt)
    if (opt.lightfood && opt.lightfood != '') {
      var lightfood = JSON.parse(opt.lightfood);
      console.log("optlightfood", lightfood)
      setTimeout(() => {
        t.setData({
          Isclosemask: true,
          lightfood: lightfood
        })
      }, 2000)
    }
    var userData = getStorageSync('userData');
    _orderid = getStorageSync('makeingId');
    uid = userData.id;
    this.setData({
      uid: uid
    })
    this.getState();
    if (getStorageSync('makeingCountDownOff')) {
      var _countDownNum = 5
      var countTimer = setInterval(() => {
        if (_countDownNum == 0) {
          clearInterval(countTimer);
          // my.reLaunch({
          //   url: '../home/home'
          // })
        }
        _countDownNum--;
        this.setData({
          countDownNum: _countDownNum,
          showOff: true
        })
      }, 1000);
    } else {
      this.setData({
        countDownNum: 0,
        showOff: true
      })
    }
    my.setStorageSync({
      key: 'makeingCountDownOff',
      data: 1
    })
  }
})