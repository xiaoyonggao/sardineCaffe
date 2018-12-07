const DES3 = require('./des3.js')
const hostUrl = 'https://www.sardinecaffe.com/index.php/api_v1/';
// 同步设置Storage值，key:键值，value:值
function setStorageSync(key, value) {
  try {
    my.setStorageSync({
      key: key,
      data: value
    });
  } catch (e) { 
    console.log(e)
  }
}

// 同步获取Storage值，key:键值，value:值
function getStorageSync(key1) {
  var obj = my.getStorageSync({ key: key1 })
  return obj.data
}

// 从本地缓存中异步移除指定 key
function removeStorage(key) {
  my.removeStorage({
    key: key
  })
}
// 获取系统信息
function getSystemInfo(that, son) {
  my.getSystemInfo({
    success: function(res) {
      switch (son) {
        case 'pixelRatio':
          that.setData({
            model: res.model
          })
        case 'width':
          that.setData({
            windowWidth: res.windowWidth
          })
        case 'height':
          that.setData({
            windowHeight: res.windowHeight
          })
        case 'version':
          that.setData({
            version: res.version
          })
        case 'platform':
          that.setData({
            platform: res.platform
          })
      }
    }
  })
}
//格式化价格，显示两位小数，当两位小数都为0是省略
function formatCurrency(content) {
  if (!content || isNaN(content)) return content;


  var v = parseFloat(content),
    result = v.toFixed(2);
  if (result.indexOf('.00') >= 0) {
    result = parseFloat(content).toFixed(0);
  }
  return result;
}
//手机号码正则匹配
// function checkMobile(sMobile) {
//   if (!(/^1\d{10}?$/.test(sMobile))) {
//     return false;
//   }
//   return true;
// }
function checkMobile(str) {
  if (!(/^1(3|4|5|7|8)\d{9}$/.test(str))) {
    return false
  } else {
    return true
  }
}
// 数字转字符串
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//参数的加密
function req_data (a) {
  var param = {};
  var jsonstr = JSON.stringify(a);
  param.inputparam = DES3.des3_encrypt(jsonstr);
  return param;
}

function fetchApi(options, callback, callbackError, wxLoginCallback) {
  // 加载动画
  if (!options.isNotLoading) {
    my.showLoading({
      content: '加载中...'
    });
  }
  options.data = options.data ? options.data : {};
  // 入参转换为字符串
  for (var x in options.data) {
    if (typeof options.data[x] == 'object') {
      options.data[x] = JSON.stringify(options.data[x]);
    }
  }
  var obj = {}
  for (var i in options.data) {
    obj[i] = options.data[i]
  }
  obj['alipay_mini_app'] = 1;
  my.httpRequest({
    url: hostUrl + options.url, //测试
    data: req_data(obj),
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'Sign': general_sign(obj),
    //   'Platform': 'wap',
    //   'Token': getStorageSync('token') || ''
    // },
    method: options.method || 'GET',
    success: function(response) {
       my.hideLoading();
       console.log("请求成功")
      var code = response.data
      var result = {
        data: response.data
      }
      callback(result);
      // if (code == 401) {
      //   // 去登陆
      //   console.log('用户信息异常,自动登录');
      //   getApp().authUser(wxLoginCallback);
      // } else if (code == 200) {
      //   callback(result);
      // } else {
      //   callbackError(result);
      // }
    },
    fail: function(response) {
       my.hideLoading();
      console.log("错误",response.data)
      my.alert({
        title:'亲',
        content:'网络错误',
        buttonText: '我知道了'
      })
    },
    complete: function(res) {
      console.log("请求完成")
       my.hideLoading();
    }
  })
}

// 发起支付，that:当前对象，params:对象(order_name,url)
function doPay(that, paySucc, payFail) {
  console.log('doPay in ...');
  var token = getStorageSync("token") ? getStorageSync("token") : '';

  if (token == '') {
    showTips(that, {
      "msg": "登录失效，请重新登录",
      "timeout": 3000
    })
    return;
  }
  var order_name = that.data.orderDetail.order_name
  fetchApi({
    url: 'index.php/api/order/mini_app_pay',
    method: 'POST',
    data: {
      order_name: order_name,
    }
  }, function(res) {
    my.tradePay({
      orderStr: res.data.message, //完整的支付参数拼接成的字符串，从服务端获取
      success: (res) => {
        paySucc(res);
       },
      fail: (res) => {
        payFail(res);
        showTips(that, {
          "msg": "支付失败",
          "timeout": 3000
        })

      }
    });
 }, function(res) {
    console.log(res)
  })
}
// 提示确认框，msg(提示信息)
function error(msg) {
  my.alert({
    title: '提示',
    content: msg,
    showCancel: false,
  });
}
//弹窗,that:当前对象，params: 对象(包含msg和timeout)
function showTips(that, params) {
  that.setData({
    customToast: {
      customToast: false,
      msg: params.msg
    }
  })

  delayHide(that, params.timeout);
}
// 隐藏提示信息，that:当前对象，tick:时间
function delayHide(that, tick) {
  tick = tick || 4000;

  if (delay) {
    clearTimeout(delay);
  }
  var delay = setTimeout(function() {
    that.setData({
      customToast: {
        customToast: true
      }
    })
  }, tick)
}
module.exports = {
  formatNumber: formatNumber, // 数字转字符串
  fetchApi: fetchApi, // API请求
  formatCurrency: formatCurrency, // 格式化价格
  setStorageSync: setStorageSync, // 同步设置本地储存
  getStorageSync: getStorageSync, // 同步获取本地储存
  removeStorage: removeStorage, // 移除本地缓存
  doPay: doPay, // 去支付
  showTips: showTips, // 显示提示信息
  getSystemInfo: getSystemInfo, // 获取系统信息
  error: error, // 提示确认框，msg(提示信息)
  checkMobile: checkMobile, //验证手机号,
}