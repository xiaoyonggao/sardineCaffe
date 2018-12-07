import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
const app = getApp();
var _uid =''
Page({
   /**
   * 页面的初始数据
   */
  data: {
    orderdetail:"",
    AdvertisementList:'',
    btnFlag: true,
    swiperTop:480,
    startX: 0, //开始坐标
    startY: 0,
    isTouchMove: true,
    isIpx:false,
    cardList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t= this
    var item = JSON.parse(options.orderdetail);
    var userData = getStorageSync('userData')
    _uid = userData.id;
    t.setData({
      orderdetail: item || [],
      isIpx: app.globalData.isIpx ? true : false
    })
    if (item.data.goodsinfo.length == 0){
        t.setData({
          btnFlag:false
        })
      }
    t.getAdvertisement()
    app.getCard(4, _uid, function (res) {
      t.setData({
        cardList: res.data.data
      })
    }) //4：有效的轻食券
 },
//获取结算页的轮播图
  getAdvertisement(){
    var t = this
     fetchApi({
      url: 'Common/getCarpartyList',
      data: { type: 4,}
    }, res => {
      t.setData({
        AdvertisementList:res.data.data
      })
    })
  },

 //返回首页
  backtohome(){
    my.reLaunch({
      url: '../home/home'
    })
  },
  touchstart(e){
  },
  touchmove(e){
    var that = this,
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
      if (Math.abs(angle) < 30) return;
      if (that.data.btnFlag){
        if (touchMoveY > startY) {
          that.setData({
            isTouchMove: false,//上滑
            btnFlag: false
          })
        } else return;
      } else return;
     
      },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})