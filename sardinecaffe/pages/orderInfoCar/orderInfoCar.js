import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
var md5 = require('../../utils/md5.js');
const app = getApp()
var _uid = '', _orderid = ''
Page({
  data: {
    myUid: '',
    address: '',
    checkAddressId: 0,
    goodsId: '',
    goodsNum: '',
    goodsinfo: '',
    goodsJson: '',
    orderIdList: '',
    provinceid: '',
    freight: '',
    total: '',
    factTotal: '',
    MaterialPrice: '',
    has_real: '',
    type: {
      0: '未知',
      1: '住宅',
      2: '公司'
    },
    goodsJson_sign: '',
    selectcard: '',//选中的现金券 
    worth: 0, //选中现金券的金额
    card_id: '',//选中现金券的id
    cid: ''//后台字段删除标记
  },

  createFn() {
    var t = this;
    fetchApi({
      url: 'Shop/ordersure1',
      data: {
        uid: _uid,
        ginfo: t.data.goodsinfo,
        addrid: t.data.address.id,
        freight: t.data.freight,
        type: 1,
        cid: t.data.cid,
        card_fee: t.data.worth,
        card_id: t.data.card_id
      }
    }, res => {
      if (res.data.status) {
        _orderid = res.data.data.orderid
        t.payFn()
      } else {
        my.alert({
          content: res.data.msg
        });
      }
    })
  },
  //支付方法
  payFn() {
    var t = this;
    var _openid = getStorageSync('openid');
    fetchApi({
      url: 'Shop/pay',
      data: {
        orderid: _orderid,
        openid: _openid,
        paytype: 1
      }
    }, res => {
      console.log("Shop/pay", res)
      if (res.data.status) {
        my.tradePay({
          tradeNO: res.data.data.payinfo.trade_no,
          success: function(res) {
            console.log("tradePay.success", res.resultCode)
            if (res.resultCode == '9000') {
              my.redirectTo({
                url: '../caffeVoucher/caffeVoucher'
              });
            }else{
              my.showToast({
              content: '支付失败,请稍后再试',
              type: 'none',
              duration: 2000
            });
            }
          },
          fail: function(res) {
            my.showToast({
              content: '支付失败',
              type: 'loading',
              duration: 2000
            });
          },
        });
      } else {
        my.alert({
          content: res.data.msg,
        });
      }

    })
  },
  //获取购买商品列表
  getGoodsInfo() {
    var goodsJson_sign = []
    var _shopListJson = getStorageSync({ key: 'shopListJson' });
    var t = this;
    fetchApi({
      url: 'Shop/ordersure1',
      data: {
        uid: _uid,
        ginfo: t.data.goodsinfo,
        type: 0
      }
    }, res => {
      if (res.data.data.card.use_list) {
        goodsJson_sign = JSON.stringify(res.data.data.card.use_list)
      }
      t.setData({
        goodsJson: res.data.data,
        goodsJson_sign: goodsJson_sign
      });
      if (t.data.goodsJson.has_real == 1) {
        var has_real = t.data.goodsJson.has_real
        t.setData({
          MaterialPrice: t.data.goodsJson.total,
          has_real: has_real
        })
        t.getFreight()
      } else {
        var has_real = t.data.goodsJson.has_real
        var factTotal = (t.data.goodsJson.total - t.data.goodsJson.benifit).toFixed(2)
        t.setData({
          freight: 0,
          factTotal: factTotal,
          has_real: has_real
        })
      }
    }, res2 => {
      console.log(res2)
    })

  },
  //页面监听卸载
  onUnload() {
  },
  //页面显示监听
  onShow() {
    // var _checkAddressId = getStorageSync({ key: 'checkAddressId' }) || 0;
    // this.setData({
    //   checkAddressId: _checkAddressId
    // });
    // // this.getDefaultAddr(1)
    // if (app.globalData.cardList) {
    //   var cardList = app.globalData.cardList.filter((item) => {
    //     return item.is_check == 1
    //   })
    //   this.setData({
    //     selectcard: cardList,
    //     worth: cardList[0].worth,
    //     card_id: cardList[0].id
    //   })
    // } else {
    //   this.setData({
    //     worth: 0,
    //     selectcard: '',
    //     card_id: ''
    //   })
    // }
  },
  //页面加载监听
  onLoad: function(opt) {
    var userData = getStorageSync('userData');
    _uid = userData.id;
    this.setData({
      goodsinfo: opt.info,
      orderIdList: opt.json.split(','),
      cid: opt.cid || '',
      myUid: _uid
    });
    if (app.globalData.cardList) {
      var cardList = app.globalData.cardList.filter((item) => {
        return item.is_check == 1
      })
      this.setData({
        selectcard: cardList,
        worth: cardList[0].worth,
        card_id: cardList[0].id
      })
    } else {
      this.setData({
        worth: 0,
        selectcard: '',
        card_id: ''
      })
    }
    this.getGoodsInfo()
    // this.getDefaultAddr(1);
  },
  //计算运费
  getFreight() {
    var t = this
    if (t.data.provinceid == '') {
      var factTotal = (t.data.MaterialPrice - t.data.goodsJson.benifit - t.data.worth).toFixed(2)
      t.setData({
        freight: 0,
        factTotal: factTotal
      })
    } else {
      fetchApi({
        url: 'Shop/getFreight',
        data: {
          total: t.data.MaterialPrice,
          provinceid: t.data.provinceid,
        }
      }, res => {
        var factTotal = (t.data.goodsJson.total + res.data.data.freight - t.data.goodsJson.benifit - t.data.worth).toFixed(2)
        t.setData({
          freight: res.data.data.freight || 0,
          factTotal: factTotal
        })
      }, res2 => {
        console.log(res2)
      })
    }
  },
  //获取默认地址
  // getDefaultAddr(a) {
  //   var t = this;
  //   fetchApi({
  //     url: 'Shop/getDefaultAddr',
  //     data: {
  //       uid: 5579,
  //       addrid: t.data.checkAddressId
  //     }
  //   }, res => {
  //     if (res.data.status) {
  //       if (res.data.status == 9999) {
  //         t.setData({
  //           address: '',
  //           provinceid: ''
  //         });
  //       } else {
  //         t.setData({
  //           address: res.data.data,
  //           provinceid: res.data.data.provinceid
  //         });
  //       }
  //       if (a) t.getGoodsInfo()
  //     } else {
  //       my.alert({
  //         title: '亲',
  //         content: res.data.msg,
  //         buttonText: '我知道了',
  //         success: () => {
  //           return;
  //         },
  //       })
  //     }
  //   }, res2 => {
  //     console.log(res2)
  //   })
  // }
})
