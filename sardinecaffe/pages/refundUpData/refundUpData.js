import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
var tempFilePathList = [],
  _imgArr = ''
const app = getApp();
Page({
  data: {
    refundPrice: '',
    mobile: '',
    phone: '',
    orderno: '',
    info: '',
    refund_reason: '',
    refund_reasoning: '',
    refunding: 0,
    imgList: [],
    ofrderStatus: '',
    color: false,
    submitFlag: false
  },
  onLoad: function(options) {
    console.log("optionsoptions",options)
    if (options.refunding && options.refunding == 1) {
      var mobile = options.mobile || '', refund_reason = options.refund_reason || '', refunding = options.refunding, img = options.img, refundPrice = options.refundPrice, status = options.status;
      img = img.split(",")
      this.setData({
        refundPrice: refundPrice,
        refund_reasoning: refund_reason,
        refunding: refunding,
        phone: mobile,
        imgList: img,
        ofrderStatus: status
      })
    } else {
      var userData = getStorageSync('userData');
      var info = options.info || '',
        refundPrice = options.refundPrice,
        orderno = options.orderno || '',
        reg = /^1[0-9]{10}$/, submitFlag = false;
      !reg.test(userData.mobile) ? submitFlag = false : submitFlag = true
      this.setData({
        info: info,
        refundPrice: refundPrice,
        mobile: userData.mobile || '',
        orderno: orderno || '',
        imgArr: [],
        submitFlag: submitFlag
      })
    }
  },
  chooseImage() {
    var t = this;
    my.chooseImage({
      count: 8 - t.data.imgArr.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var newArr = t.data.imgArr;
        tempFilePaths.map(function(o) {
          newArr.push(o)
        })
        t.setData({
          imgArr: newArr
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  bindconfirmPhone(e) {
    var re = /^1[0-9]{10}$/
    if (!re.test(e.detail.value)) {
      my.showToast({
        content: '请输入正确的手机号码',
        type: 'none',
        duration: 2000
      })
      this.setData({
        mobile: e.detail.value,
        submitFlag: false
      })
    } else {
      this.setData({
        mobile: e.detail.value,
        submitFlag: true
      })
    }

  },
  bindblurPhone(e) {
    var re = /^1[0-9]{10}$/
    if (!re.test(e.detail.value)) {
      my.showToast({
        content: '请输入正确的手机号码',
        type: 'none',
        duration: 2000
      })
      this.setData({
        color: false,
        submitFlag: false,
        mobile: e.detail.value
      })
    } else {
      this.setData({
        color: true,
        submitFlag: true,
        mobile: e.detail.value
      })
    }
  },
  bindconfirm(e) {
    this.setData({
      refund_reason: e.detail.value
    })
  },
  bindblur(e) {
    this.setData({
      refund_reason: e.detail.value
    })
  },
  refund_submit() {
    var t = this
    var re = /^1[0-9]{10}$/
    if (!re.test(t.data.mobile)) {
      my.showToast({
        content: '请填写正确的手机号码',
        type: 'none',
        duration: 2000
      })
      return;
    } else {
      //上传图片
      my.showToast({
        content: '正在提交申请',
        type: 'loading',
        duration: 100000
      });
      if (t.data.imgArr.length == 0) {
        t.submit()
      } else {
        t.uploadImg()
      }
    }
  },
  submit(data) {
    var t = this;
    fetchApi({
      url: 'Citybox/boxRefund1',
      data: {
        orderno: t.data.orderno,
        ginfo: t.data.info,
        refund_reason: t.data.refund_reason,
        img: data || '',
        phone: t.data.mobile,
        origin:"ali"
       }
    }, res => {
      console.log("res", res)
      if (res.data.status == 1) {
        // my.hideToast();
        my.showToast({
          content: res.data.msg,
          type: 'success',
          duration: 3000,
          success: function(res) {
            my.reLaunch({
              url: '../userCenter/userCenter'
            })
          }
        })
      } else {
        // my.hideToast();
        my.showToast({
          content: '提交失败,请稍候在试',
          type: 'none',
          duration: 2000
        })
      }
    })
  },
  uploadImg() {
    var t = this
    var localIds = t.data.imgArr;
    if (localIds.length == 0) {
      t.submit(_imgArr)
    } else {
      my.uploadFile({
        url: app.URL + 'Upload/upForumImg',
        filePath: localIds[0],
        name: 'image',
        success: function(res) {
          localIds.shift();
          var data = JSON.parse(res.data)
          _imgArr += data.data.file_url + ','
          t.uploadImg();
        }
      })
    }
  }
})