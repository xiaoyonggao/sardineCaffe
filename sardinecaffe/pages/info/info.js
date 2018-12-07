//获取应用实例
import {
  fetchApi,
  getStorageSync,
} from '../../utils/util.js';
var md5 = require('../../utils/md5.js');
const app = getApp();
//用户信息
var _userData = "";

//咖啡的id
var pid = '';
var logid = '';
var num1 = 0, num2 = 0, num3 = 0, hot_nosuger = '', cold_id = '', hot_id = "", cold_nosuger = ""
Page({
  data: {
    showOff: false,
    info: '',
    coffee: '',
    sugar: '',
    milk: '',
    tea: '',
    vmcCode: '',
    tabHot: ['热咖啡', '冰咖啡'],
    tipTitle: '咖啡大师推荐口味',
    is_collect: '',
    shoucanOff: false,
    shoucanName: '',
    shoucanVal: '',
    vpid: '',
    ice_machine: '',
    isIpx: '',
    send_lightfoodcard: 0
  },
  //切换热咖啡
  changeHot(e) {
    this.setData({
      vpid: this.data.info.hot_id
    })
  },
  //切换冷咖啡
  changeCol() {
    this.setData({
      vpid: this.data.info.cold_id
    });
  },

  //购买咖啡的优惠券
  bugCaffeFn() {
    my.navigateTo({
      url: '../caffeeCoupon/caffeeCoupon'
    })
  },

  //获取咖啡详情
  getInfo() {
    var t = this;
    fetchApi({
      url: 'Coffee/getCoffeeDetail',
      data: {
        uid: _userData.id,
        collect_id: logid,
        vmc: t.data.vmcCode,
        pid: pid
      }
    }, res => {
      console.log("res", res)
      t.setData({
        showOff: true,
        //vpid 默认冷饮或热饮id
        vpid: res.data.data.vpid,
        info: res.data.data,
        shoucanVal: res.data.data.c_cnname || '',
        coffee: res.data.data.flavor.coffee - 1,
        sugar: res.data.data.flavor.sugar - 1,
        milk: res.data.data.flavor.milk - 1,
        tea: res.data.data.flavor.tea - 1,
        shoucanName: res.data.data.cnname,
        is_collect: res.data.data.is_collect,
        ice_machine: res.data.data.ice_machine,
        send_lightfoodcard: res.data.data.is_send_lightfoodcard || 0
      })
      hot_nosuger = res.data.data.hot_nosuger,
        hot_id = res.data.data.hot_id,
        cold_nosuger = res.data.data.cold_nosuger,
        cold_id = res.data.data.cold_id
    }, res => {
      //待处理的失败信息
      console.log('查询错误')
    })


  },
  //页面的监听加载 （opt:设备号vmc，咖啡的id）
  onLoad(opt) {
    this.setData({
      isIpx: app.globalData.isIpx ? true : false
    })
    var t = this;
    pid = opt.id;
    logid = opt.logid || '';
    this.setData({
      vmcCode: opt.vmc
    })
    _userData = getStorageSync('userData');
    this.getInfo();
    console.log("第几次进来")
  },

  //改变咖啡浓度
  changeCoffee(e) {
    console.log("这是个啥", e)
    this.setData({
      coffee: e.detail.value
    });
    num1++
    console.log("这是个啥556465", num1)
    if (e.detail.value == 0) {
      this.setData({
        tipTitle: '淡淡的，就很好'
      });
    } else if (e.detail.value == 4) {
      this.setData({
        tipTitle: '有故事的人，偏爱浓郁芬芳'
      });
    } else {
      if (this.data.milk == 0) {
        this.setData({
          tipTitle: '去除浮华，更醇香'
        })
      } else if (this.data.milk == 4) {
        this.setData({
          tipTitle: '满满的幸福'
        })
      } else if (this.data.sugar == 0) {
        this.setData({
          tipTitle: '生活需要一点苦涩'

        })
      } else if (this.data.sugar == 4) {
        this.setData({
          tipTitle: '甜蜜一整天'
        })
      } else {
        this.setData({
          tipTitle: '咖啡大师推荐口味'
        })
      }
    };
  },
  //改变奶泡浓度
  changeMilk(e) {
    this.setData({
      milk: e.detail.value
    });
    num2++
    if (e.detail.value == 0) {
      this.setData({
        tipTitle: '去除浮华，更醇香'
      });
    } else if (e.detail.value == 4) {
      this.setData({
        tipTitle: '满满的幸福'
      })
    } else {
      if (this.data.coffee == 0) {
        this.setData({
          tipTitle: '淡淡的，就很好'
        })
      } else if (this.data.coffee == 4) {
        this.setData({
          tipTitle: '有故事的人，偏爱浓郁芬芳'
        })
      } else if (this.data.sugar == 0) {
        this.setData({
          tipTitle: '生活需要一点苦涩'
        })
      } else if (this.data.sugar == 4) {
        this.setData({
          tipTitle: '甜蜜一整天'
        })
      } else {
        this.setData({
          tipTitle: '已为您调配至咖啡大师标准口味'
        })
      }
    };
  },
  //改变糖浓度
  changeSugar(e) {
    if (this.data.ice_machine == 1) {
      if (this.data.vpid == hot_id) {
        this.setData({
          sugar: e.detail.value,
          vpid: hot_id
        });
      } else {
        this.setData({
          sugar: e.detail.value,
          vpid: cold_id
        });
      }
    }
    num3++
    if (e.detail.value == 0) {
      if (this.data.vpid == hot_id) {
        this.setData({
          tipTitle: '生活需要一点苦涩',
          vpid: hot_nosuger
        })
      } else {
        this.setData({
          tipTitle: '生活需要一点苦涩',
          vpid: cold_nosuger
        })
      }
      console.log("生活需要一点苦涩", this.data.vpid)
    } else if (e.detail.value == 4) {
      this.setData({
        tipTitle: '甜蜜一整天'
      })
    } else {
      if (this.data.coffee == 0) {
        this.setData({
          tipTitle: '淡淡的，就很好'
        })
      } else if (this.data.coffee == 4) {
        this.setData({
          tipTitle: '有故事的人，偏爱浓郁芬芳'
        })
      } else if (this.data.milk == 0) {
        this.setData({
          tipTitle: '去除浮华，更醇香'
        })
      } else if (this.data.milk == 4) {
        this.setData({
          tipTitle: '满满的幸福'
        })
      } else {
        this.setData({
          tipTitle: '已为您调配至咖啡大师标准口味'
        })
      }
    };
    console.log("wouasdjo i", this.data.vpid)
  },

  //改变茶浓度
  changeTea(e) {
    this.setData({
      tea: e.detail.value
    })
    console.log(e.detail.value)
  },
  //收藏
  shoucanFn() {
    var t = this;
    this.setData({
      shoucanOff: true
    });
  },
  //选择咖啡券支付
  payFn2() {
    var t = this;
    my.confirm({
      title: '提示',
      content: '您将消耗一张' + t.data.info.cnname + '券',
      success: function(res) {
        if (res.confirm) {
          my.getStorage({
            key: 'openid',
            success: res => {
              fetchApi({
                url: 'Coffee/createOrder',
                data: {
                  uid: _userData.id,
                  pid: pid,
                  vpid: t.data.vpid,
                  vmc: t.data.vmcCode,
                  flavor: 'coffee,' + (+t.data.coffee + 1 || 0) + '|milk,' + (+t.data.milk + 1 || 0) + '|sugar,' + (+t.data.sugar + 1 || 0) + '|tea,' + (+t.data.tea + 1 || 0),
                  paytype: 1,
                  openid: res.data
                }
              }, data => {
                console.log("hahhaha咖啡卷1", data)
                if (data.data.status == 2) {
                  var lightfood = ''
                  if (data.data.data.lightfood != '') {
                    lightfood = JSON.stringify(data.data.data.lightfood)
                  }
                  my.showToast({
                    content: '支付成功',
                    type: 'success',
                    duration: 2000,
                    success: function() {
                      // my.setStorageSync('makeingId', data.data.data.orderid);
                      my.setStorageSync({
                        key: 'makeingId',
                        data: data.data.data.orderid
                      });
                      my.setStorageSync({
                        key: 'makeingCountDownOff',
                        data: 1
                      })
                      my.setStorageSync({
                        key: 'makeingCaffeName',
                        data: t.data.info.cnname
                      })
                      my.redirectTo({
                        url: '../making/making?orderid=' + data.data.data.orderid + '&lightfood=' + lightfood,
                      });
                    }
                  })
                } else {
                  console.log("hahhaha咖啡卷2", data)
                  my.alert({
                    title: '提示',
                    content: data.data.msg
                  });
                }
              })

            }
          });
        }
      }
    });
  },
  //选支付宝支付
  payFn() {
    var t = this;
    my.getStorage({
      key: 'openid',
      success: res => {
        fetchApi({
          url: 'Coffee/createOrder',
          data: {
            uid: _userData.id,
            pid: pid,
            vpid: t.data.vpid,
            vmc: t.data.vmcCode,
            flavor: 'coffee,' + (+t.data.coffee + 1 || 0) + '|milk,' + (+t.data.milk + 1 || 0) + '|sugar,' + (+t.data.sugar + 1 || 0) + '|tea,' + (+t.data.tea + 1 || 0),
            paytype: 2,
            openid: res.data
          }
        }, data => {
          console.log("支付返回的订单", data)
          t.payment(data)
        })
      }
    });

  },
  payment(res) {
    var t = this;
    if (res.data.status == 1) {
      my.tradePay({
        tradeNO: res.data.data.payinfo.trade_no,
        success: function(a) {
          if (a.resultCode == '9000') {
            fetchApi({
              url: 'Coffee/wechat_pay_send_lightcard',
              data: {
                orderno: res.data.data.orderno
              }
            }, res2 => {
              console.log("wechat_pay_send_lightcard", res2)
              var lightfood = ''
              if (res2.data.data != '') {
                lightfood = JSON.stringify(res2.data.data)
              }
              //开启支付成功，跳转我的订单
              console.log("开启支付成功储存makeingId", res.data.data.orderid)
              my.setStorageSync({
                key: 'makeingId',
                data: res.data.data.orderid
              });
              my.setStorageSync({
                key: 'makeingCountDownOff',
                data: 1
              })
              my.setStorageSync({
                key: 'makeingCaffeName',
                data: t.data.info.cnname
              })
              my.redirectTo({
                url: '../making/making?orderid=' + res.data.data.orderid + '&lightfood=' + lightfood
              });
            })
          }

        },
        fail: function(a) {
          my.showToast({
            content: '支付失败',
            type: 'loading',
            duration: 2000
          });
        }
      })
    } else {
      my.alert({
        title:'提示',
        content: res.data.msg
      });
    }

  }
})
