import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
const app = getApp();
Page({
  /**
  * 页面的初始数据
  */
  data: {
    OrderDetail: '',
    _uid: '',
    orderId: '',
    windowHeight: ''
  },

  //citybox的订单详情
  boxOrderDetail(id) {
    fetchApi({
      url: 'Citybox/boxOrderDetail',
      data: {
        id: id
      }
    }, res => {
      console.log("citybox的订单详情", res)
      this.setData({
        OrderDetail: res.data.data
      })
    })
  },
  withdrawPay(opt) {
    var orderdetail = JSON.stringify(opt.target.dataset.orderdetail)
    my.navigateTo({
      url: '../applyRefund/applyRefund?orderdetail=' + orderdetail
    })
  },
  //退款中,退款成功，退款失败
  withdrawPaying(opt) {
    var orderno = opt.currentTarget.dataset.orderdetail.orderno
    fetchApi({
      url: 'Citybox/boxRefundDetail',
      data: {
        orderno: orderno
      }
    }, res => {
      if (res.data.status == 1) {
        var res = res.data.data;
        var img = res.img, refundPrice = res.refund_fee, mobile = res.phone, refund_reason = res.refund_reason, status = res.status;
        img = img.substr(0, img.length - 1);
        my.navigateTo({
          url: '../refundUpData/refundUpData?img=' + img + '&refundPrice=' + refundPrice + '&status=' + status + '&mobile=' + mobile + '&refund_reason=' + refund_reason + '&refunding=1' + '&status=' + status
        })
      } else {
        my.showToast({
          content: res.data.msg,
          type: 'none',
          duration: 2000
        })
      }
    })
  },
  //去付款
  goToPay(opt) {
    var t = this
    var _openid = getStorageSync('openid');
    fetchApi({
      url: 'Citybox/payBoxAgain',
      data: {
        orderno: opt.target.dataset.orderno,
        openid: _openid
      }
    }, res => {
      if (res.data.status == 0) {
        console.log("alertalert",res)
        my.alert({
          title: '提示',
          content: res.data.msg,
          buttonText: '我知道了',
          success: function(res) {
               return;
          }
        })
      } else if (res.data.status == 1) {
        console.log("tradePay == 1", res.data.data.payinfo.trade_no)
        my.tradePay({
          tradeNO: res.data.data.payinfo.trade_no,
          success: function(res) {
            if (res.resultCode == '9000') {
               this.boxOrderDetail(t.data.orderId)
            } else {
              my.showToast({
                content: '支付异常,请稍后再试',
                type: 'none',
                duration: 2000
              });
              this.boxOrderDetail(t.data.orderId)
            }
          }
        })
        // my.requestPayment({
        //   nonceStr: res.data.data.payinfo.nonce_str,
        //   package: "prepay_id=" + res.data.data.payinfo.prepay_id,
        //   signType: 'MD5',
        //   timeStamp: (res.data.data.payinfo.timeStamp).toString(),
        //   paySign: sign,
        //   success: function(a) {
        //     setTimeout(() => {
        //       t.boxOrderDetail(opt.target.dataset.orderno)
        //     }, 2000)
        //   },
        //   fail: function(a) {
        //     my.showToast({
        //       title: '支付失败',
        //       icon: 'loading',
        //       duration: 2000
        //     });
        //   }
        // })

      }
    })
  },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function(opt) {
    var t = this, userData = my.getStorageSync('userData');
    this.setData({
      _uid: userData.id,
      orderId: opt.id,
      windowHeight: app.globalData.windowHeight - 60
    })
    this.boxOrderDetail(t.data.orderId)
  },
  onShow: function() {
    if (this.data.orderId && this.data._uid) {
      this.boxOrderDetail(this.data.orderId)
    }
  }
})
