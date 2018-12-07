//获取应用实例
import {
  fetchApi,
  getStorageSync,
} from '../../utils/util.js'
const app = getApp();
var moveOff = true,
  _userData = '';
Page({
  data: {
    arr: [],
    arr2: [],
    motto: 'Hello World',
    showBtn: true,
    activeIndex: "",
    vmcCode: '',
    cityBoxVmc: '',
    caffelistoff: false,
    is_qianyue: '',
    is_employee: '',
    notice: false, //通知栏
    is_send_coupon: '',
    options: '',//扫码的信息
    extraData: ''//签约小程序的参数
  },
  onShow() {
    var t = this;
    // var scope_Info = my.getStorageSync("scope_Info");
    // if (scope_Info == 0) {
    //   my.navigateTo({
    //     url: '../login/login?scope=0'
    //   })
    // } else {
    //   if (this.data.is_qianyue == 1) {
    //   this.setData({
    //     is_qianyue: 0
    //   })
    //   my.reLaunch({
    //     url: '../home/home'
    //   })

    // }
    // }
  },

  goHomeBtn() {
    my.reLaunch({
      url: '../home/home'
    })
  },
  
  //根据设备获取咖啡列表
  getArrList() {
    var t = this;
    fetchApi({
      url: 'Coffee/getCoffeeByVmc',
      data: {
        uid: _userData.id,
        vmc: t.data.vmcCode,
        pagenum: 1,
        pagesize: 9999
      }
    }, res => {
      console.log("hahahhah111", res)
      t.setData({
        is_employee: res.data.extends,
        arr: res.data.data || []
      })
  },res=>{
    my.alert({
        title: '提示',
        content: '网络错误',
        buttonText: '我知道了',
        success: function(res) {
          my.reLaunch({
              url: '../home/home'
            })
        }
      })
  })
  },
  //跳转咖啡详情
  getCoffee(e) {
    var material = e.currentTarget.dataset.material
    var productId = e.currentTarget.dataset.id
    var t = this;
    if (material == 0) {
      t.setData({
        notice: true
      })
      setTimeout(() => {
        t.setData({
          notice: false
        })
      }, 2000)
    } else {
      fetchApi({
        url: 'Coffee/getDeviceStatus',
        data: {
          vmc: t.data.vmcCode,
          id: productId
        }
      }, res => {
        if (res.data.status == 1) {
          my.navigateTo({
            url: '../info/info?id=' + productId + '&vmc=' + t.data.vmcCode
          })
        }
      })
    }
  },
  close_tip() {
    this.setData({
      notice: false
    })
  },
  send_coupon_erro() {
    this.setData({
      is_send_coupon: 0
    });
  },
  send_coupon_get() {
    this.setData({
      is_send_coupon: 0
    });
    setTimeout(() => {
      my.showToast({
        content: '领取成功！',
        type: 'success'
      })
    }, 500)
  },
  //判断是否是第一次用户
  is_first(uid) {
    var t = this
    fetchApi({
      url: 'User/isFirst',
      data: {
        uid: _userData.id,
      }
    }, res => {
      t.setData({
        is_send_coupon: res.data.data.is_send_coupon
      });
    })
  },
  //页面监听加载
  onLoad(options) {
    var t = this;
    _userData = getStorageSync('userData')
    this.setData({
      vmcCode: options.vmcId
    })
    t.getArrList()
  }
})