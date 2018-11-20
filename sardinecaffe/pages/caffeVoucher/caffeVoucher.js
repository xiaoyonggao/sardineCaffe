import {
  fetchApi
} from '../../utils/util.js';
var app = getApp();
var _uid = "",
  _touid = '',
  active_Index = -1,
  page = 1
Page({
  data: {
    cardList: [],
    checkedArr: [],
    successArr: '',
    checked: false,
    disabled: false,
    selected: true,
    selected1: false,
    selected2: false,
    selected3: false,
    couponType: 1, //券的类型
    isIpx: '',
    starX: 0, //开始坐标
    startY: 0,
    isTouchMove: false,
    caffeId: '',
    DialogMask: false,
    shareBgm: 'http://www.sardinecaffe.com/Uploads/tinified/',
    pagenum: 1,
    pagesize: 5,
    dataIdType: ''
  },
  onReady: function() {
    my.hideShareMenu()
  },
  onLoad: function(opt) {
    var pages = getCurrentPages();
    this.setData({
      isIpx: app.globalData.isIpx
    })
    var userData = my.getStorageSync('userData');
    _touid = opt.touid || '';
    _uid = userData.id;
    if (opt.source && opt.source != '') {
      if (opt.source == 1) {
        this.selected()
      } else if (opt.source == 5) {
        this.selected3()
      }
    } else {
      this.getCard(this.data.couponType);
    }
  },
  // getScanCode() {
  //   var t = this;
  //   t.setData({
  //     Isclosemask: false,
  //   })
  //   my.scanCode({
  //     onlyFromCamera: true,
  //     success: (res) => {
  //       var opotion1 = {}
  //       var opotion2 = {}
  //       var resData = res.result.split('=')[1]
  //       if (resData) {
  //         if (resData.split('_')[0] == 'coffee') {
  //           opotion1.vmc = resData.split('_')[1]
  //           opotion1.scan = 1
  //           var scanInfo = JSON.stringify(opotion1);
  //           my.navigateTo({
  //             url: '../caffeList/caffeList?scanInfo=' + scanInfo
  //           })
  //         } else if (resData.split('_')[0] == 'citybox') {
  //           opotion2.q = escape(res.result)
  //           opotion2.scan = 0
  //           var scanInfo = JSON.stringify(opotion2);
  //           my.navigateTo({
  //             url: '../caffeList/caffeList?scanInfo=' + scanInfo
  //           })
  //         } else {
  //           my.showModal({
  //             content: '未取得设备号',
  //             showCancel: false
  //           });
  //         }
  //       } else {
  //         my.showModal({
  //           content: '未取得设备号',
  //           showCancel: false
  //         });
  //       };
  //     }
  //   })
  // },
  onShow() {
    this.setData({
      checkedArr: [],
      DialogMask: false
    })
    // if (_uid) this.getCard(this.data.couponType);
  },
  //获取咖啡券列表
  getCard(_type) {
    var that = this;
    this.setData({
      cardList: []
    });
    fetchApi({
      url: 'Card/getCardlist',
      data: {
        uid:'5579',
        type: _type,
        pagenum: that.data.pagenum,
        pagesize: that.data.pagesize
      }
    }, res => {
        var resData = res.data.data.map((item) => {
        return Object.assign({}, item, {
          isTouchMove: false //默认全隐藏删除
        })
      })
        that.setData({
        cardList: resData
      });
    }, res2 => {
      console.log("callbackError",res2)
    })
  },
  sendVoncher(opt) {
    var t = this,
      caffeId = opt.currentTarget.dataset.id;
    if (_touid) {
      app.ajax(app.URL + 'Card/giveCard', {
        uid: _uid,
        touid: _touid,
        logids: caffeId
      }, function(res) {
        console.log(res)
        if (res.data.status) {
          t.setData({
            successArr: res.data.data
          });
          setTimeout(function() {
            my.navigateBack({
              delta: 1
            });
          }, 2000)

        } else {
          my.showModal({
            content: res.data.msg,
            showCancel: false
          });
        }
      })
    } else {
      my.navigateTo({
        url: '../sendCardList/sendCardList?uid=' + _uid + '&logids=' + caffeId
      })
    }

  },
  selected: function(e) {
    page = 1
    this.setData({
      selected: true,
      selected1: false,
      selected2: false,
      selected3: false,
      couponType: 1
    })
    this.getCard(this.data.couponType)
  },
  selected1: function(e) {
    page = 1
    this.setData({
      selected: false,
      selected1: true,
      selected2: false,
      selected3: false,
      couponType: 2
    })
    this.getCard(this.data.couponType)
  },
  selected2: function(e) {
    page = 1
    this.setData({
      selected: false,
      selected1: false,
      selected2: true,
      selected3: false,
      couponType: 3
    })
    this.getCard(this.data.couponType)
  },
  selected3: function(e) {
    page = 1
    this.setData({
      selected: false,
      selected1: false,
      selected2: false,
      selected3: true,
      couponType: 4
    })
    this.getCard(this.data.couponType)
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart(e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cardList: this.data.cardList
    })
  },
  touchmove(e) {
    this.data.cardList.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    that.data.cardList.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      cardList: that.data.cardList
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y   //返回角度 /Math.atan()返回数字的反正切值

    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //赠送按钮
  sendbtn(opt) {
    var t = this,
      Id = opt.currentTarget.dataset.id,
      dataIdType = opt.currentTarget.dataset.type;
    // bgimg = opt.currentTarget.dataset.bgm;
    if (dataIdType == 0) {
      my.showToast({
        title: '通用券不能赠送!',
        icon: "none",
        duration: 1000
      })
    } else {
      t.setData({
        caffeId: Id,
        dataIdType: dataIdType,
        DialogMask: true
        // shareBgm: bgimg
      })
    }
  },
  cancelSend() {
    this.data.cardList.forEach(function(v, i) {
      v.isTouchMove = false
    })
    this.setData({
      cardList: this.data.cardList,
      caffeId: '',
      DialogMask: false,
      dataIdType: ''
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    page = page + 1;
    fetchApi({
      url: 'Card/getCardlist',
      data: {
        uid: '5579',
        type: that.data.couponType,
        pagenum: page,
        pagesize: that.data.pagesize
      }
    }, res => {
      if (res.data.status == 1) {
        if (res.data.data.length != 0) {
          var resData = res.data.data.map((item) => {
            return Object.assign({}, item, {
              isTouchMove: false //默认全隐藏删除
            })
          })
          var moment_list = that.data.cardList
          for (var i = 0; i < resData.length; i++) {
            moment_list.push(resData[i]);
          }
          that.setData({
            cardList: moment_list
          })
        } else {
          page = page - 1
          my.showToast({
            content: '没有更多了！',
            type: 'none',
            duration: 2000,
            success: () => {
              my.hideToast()
            },
          })
        }
      } else {
        console.log("没有更多了！")
        page = page - 1
        my.showToast({
          content: '没有更多了！',
          type: 'none',
          duration: 2000,
          success: () => {
            my.hideToast()
          },
        })
      }
    }, res2 => {
      console.log("callbackError", res2)
    })
  },
  //分享按钮函数
  onShareAppMessage: function(ops) {
    var t = this, caffeId = ops.target.dataset.id, dataIdType = t.data.dataIdType
    return {
      title: '小伙伴送了张咖啡券',
      imageUrl: t.data.shareBgm + dataIdType + '.png',
      path: 'pages/home/home?sendshare=1&user_id=' + _uid + '&caffeId=' + caffeId,
      success: function(res) {
        console.log("hahhaha???", res)
        app.ajax2(app.URL + 'Card/lockCard', {
          uid: _uid,
          card_id: caffeId
        }, function(res) {
          console.log("小伙伴送了张咖啡券", res.data)
          if (res.data.status == 1) {
            my.showToast({
              title: '分享成功',
              icon: 'success',
              duration: 4000
            })
          } else {
            my.showToast({
              title: '分享失败',
              icon: "none",
              duration: 4000
            })
          }
        })
      },
      fail: function(res) {
        my.showToast({
          title: '分享失败',
          icon: "none",
          duration: 2000
        })
      }
    }
  },
  onUnload() {
    page = 1
  }
})