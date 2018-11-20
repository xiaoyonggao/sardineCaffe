import {
  fetchApi
} from '../../utils/util.js';
const app = getApp();
var page = 1, userData = '', is_has = true;
Page({
  data: {
    arrData: [],
    pagenum: 1,
    pagesize: 4,
    isHideLoadMore: false,
    isMore: false,
    count: 1
  },
  onLoad: function() {
    is_has = true
    var t = this
    // userData = wx.getStorageSync('userData');
    fetchApi({
      url: 'Coffee/getOrderList',
      data: {
        uid: '5579',
        pagenum: t.data.pagenum,
        pagesize: t.data.pagesize
      }
    }, res => {
      t.setData({
        arrData: res.data.data || []
      })
    }, res2 => {
      console.log("callbackError", res2)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var t = this;
    // 页数+1
    if (is_has) {
      t.setData({
        isHideLoadMore: true
      })
      page = page + 1;
      fetchApi({
        url: 'Coffee/getOrderList',
        data: {
          uid: '5579',
          pagenum: page,
          pagesize: t.data.pagesize
        }
      }, res => {
        if (res.data.status == 1) {
          if (res.data.data.lenght != 0) {
            t.setData({
              isHideLoadMore: false
            })
            var Coffee_list = t.data.arrData;
            for (var i = 0; i < res.data.data.length; i++) {
              Coffee_list.push(res.data.data[i]);
            }
            t.setData({
              arrData: Coffee_list
            })
          } else {
            is_has = false
            page = page - 1
            t.setData({
              count: page,
              isMore: true,
              isHideLoadMore: false
            })
          }
        } else {
          is_has = false
          page = page - 1
          t.setData({
            count: page,
            isMore: true,
            isHideLoadMore: false
          })
        }
      }, res2 => {
        console.log("callbackError", res2)
      })

    } else {
      return;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
