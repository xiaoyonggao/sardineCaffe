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
  //微信支付
  createFn() {
    var t = this;
    app.ajax(app.URL + 'Shop/ordersure1', {
      uid: _uid,
      ginfo: t.data.goodsinfo,
      addrid: t.data.address.id,
      freight: t.data.freight,
      type: 1,
      cid: t.data.cid,
      card_fee: t.data.worth,
      card_id: t.data.card_id
    }, function(res) {

      if (res.data.status) {
        _orderid = res.data.data.orderid
        wx.setStorageSync('shopCountSize', res.data.data.shopcarnum)
        t.payFn()
      } else {
        wx.showModal({
          content: res.data.msg,
          showCancel: false
        });
      }
    })
  },
  //微信支付方法
  payFn() {
    var t = this;
    var _openid = wx.getStorageSync('openid');
    app.ajax(app.URL + 'Shop/pay', {
      orderid: _orderid,
      openid: _openid,
    }, function(res) {
      if (res.data.status) {
        //支付接口请求成功，开启微信支付
        var _paceage = "prepay_id=" + res.data.data.payinfo.prepay_id
        var stringA = "appId=wxbe5457a7fafda699&nonceStr=" + res.data.data.payinfo.nonce_str + "&package=" + _paceage + "&signType=MD5&timeStamp=" + res.data.data.payinfo.timeStamp + "&key=d4wkln4n48sienvds9s4lwrjsdo4jfw4";
        var sign = md5.md5(stringA).toUpperCase();
        wx.requestPayment({
          nonceStr: res.data.data.payinfo.nonce_str,
          package: "prepay_id=" + res.data.data.payinfo.prepay_id,
          signType: 'MD5',
          timeStamp: (res.data.data.payinfo.timeStamp).toString(),
          paySign: sign,
          success: function(a) {
            //开启微信支付成功，跳转我的订单
            var _shopListJson = wx.getStorageSync('shopListJson') || {};
            t.data.orderIdList.map(function(o) {
              delete _shopListJson[o];
            });
            if (t.data.has_real == 1) {
              wx.setStorage({
                key: "shopListJson",
                data: _shopListJson,
                success() {
                  wx.redirectTo({
                    url: '../market/market'
                  });
                }
              });
            } else {
              wx.setStorage({
                key: "shopListJson",
                data: _shopListJson,
                success() {
                  wx.redirectTo({
                    url: '../caffeVoucher/caffeVoucher'
                  });
                }
              });
            }
          },
          fail: function(a) {
            wx.showToast({
              title: '支付失败',
              icon: 'loading',
              duration: 2000
            });
          }
        })
      } else {
        wx.showModal({
          content: res.data.msg,
          showCancel: false
        });
      }

    })
  },
  //获取购买商品列表
  getGoodsInfo() {
    var goodsJson_sign = []
    var _shopListJson = getStorageSync({key:'shopListJson'});
    var t = this;
    fetchApi({
      url: 'Shop/ordersure1',
      data: {
        uid: 5579,
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
    },res2=>{
      console.log(res2)
    })

  },
  //页面监听卸载
  onUnload() {
    app.globalData.cardList = ""
    // this.setData({
    //   worth: 0,
    //   card_id: '',
    //   selectcard: ''
    // })
  },
  //页面显示监听
  onShow() {
    var _checkAddressId = getStorageSync({ key: 'checkAddressId'}) || 0;
    this.setData({
      checkAddressId: _checkAddressId
    });
    this.getDefaultAddr(1)
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
  },
  //页面加载监听
  onLoad: function(opt) {
    // var userData = wx.getStorageSync('userData');
    // _uid = userData.id;
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
    this.getDefaultAddr(1);
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
      },res2=>{
        console.log(res2)
      })
    }
  },
  //获取默认地址
  getDefaultAddr(a) {
    var t = this;
    fetchApi({
      url: 'Shop/getDefaultAddr',
      data: {
        uid: 5579,
        addrid: t.data.checkAddressId
      }},res =>{
        if (res.data.status) {
          if (res.data.status == 9999) {
            t.setData({
              address: '',
              provinceid: ''
            });
          } else {
            t.setData({
              address: res.data.data,
              provinceid: res.data.data.provinceid
            });
          }
          if (a) t.getGoodsInfo()
        } else {
          my.alert({
            title: '亲',
            content: res.data.msg,
            buttonText: '我知道了',
            success: () => {
             return;
            },
          })
        }
      },res2 =>{
        console.log(res2)
      })
  }
})
