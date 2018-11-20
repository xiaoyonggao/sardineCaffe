import {
  fetchApi
} from '../../utils/util.js';
const app = getApp();
var _uid = "", page = 1, is_has = true;
Page({
    data: {
    myUid: '',//用户ID
    recordList: '',
    isHideLoadMore: false,
    isMore: false,
    pagenum: 1,
    pagesize: 4,
    count: 1
  },
  //轻食消费记录
  boxOrederList(useid, pagenum) {
    fetchApi({
      url: 'Citybox/boxOrederList',
      data: {
        uid: useid,
        pagenum: pagenum,
        pagesize: this.data.pagesize
      }
    }, res => {
      if (res.data.status == 1) {
        if (res.data.data.length != 0) {
          this.setData({
            recordList: res.data.data || [],
          })
        } else {
          recordList: []
        }
      }
    }, res2 => {
      console.log(res2)
    })
  },
  OrederList(opt) {
    var oderId = opt.currentTarget.dataset.id
    my.navigateTo({
      url: '../customDetail/customDetail?id=' + oderId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var t = this;
    is_has = true
    // var userData = my.getStorageSync('userData')
    // t.setData({
    //   myUid: userData.id
    // });
    t.boxOrederList(5579, this.data.pagenum)
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
    if (this.data.myUid) {
      this.boxOrederList(5579, this.data.pagenum)
    }
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
        url: 'Citybox/boxOrederList',
        data: {
          uid: 5579,
          pagenum: page,
          pagesize: this.data.pagesize
        }
      }, res => {
        if (res.data.status == 1) {
          if (res.data.data != 0) {
            t.setData({
              isHideLoadMore: false
            })
            var Coffee_list = t.data.recordList;
            for (var i = 0; i < res.data.data.length; i++) {
              Coffee_list.push(res.data.data[i]);
            }
            t.setData({
              recordList: Coffee_list
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
        console.log(res2)
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