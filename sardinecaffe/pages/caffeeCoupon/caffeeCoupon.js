import {
  fetchApi
} from '../../utils/util.js';
const app = getApp();
var _uid = '';
Page({
  data: {
    caffee_list: '',
    total: 0,
    count: 0,
    discount: 0,
    discount_total: 0,
    ginfo: '',
    json: '',
    isIpx: '',
    title: '', //活动折扣
    expiration: '' //有效期
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    var t = this;
    // var userData = my.getStorageSync('userData')
    // _uid = userData.id;
    this.setData({
      isIpx: app.globalData.isIpx ? true : false,
    })
    t.getShopList(opt.id)
  },
  //获取咖啡券列表
  getShopList(id) {
    var t = this
    fetchApi({
      url: 'Shop/getCardList',
      data: {
        uid: 5579,
        cateid: 1,
        pagesize: 9999,
        pagenum: 1,
        id: id
      }
    }, res => {
        var caffee_list = res.data.data.list,
        caffeeType = res.data.data.active.type,
        caffeeContent = res.data.data.active.content,
        caffeeTitle = res.data.data.active.title,
        caffeeDis = res.data.data.active.discount;
        caffee_list.map((o) => {
        o.chekcNum = 0
        if (o.id == id) {
          o.chekcNum = 1
        }
      })
      t.setData({
        caffee_list: caffee_list,
        caffeeContent: caffeeContent,
        caffeeTitle: caffeeTitle,
        caffeeType: caffeeType
      })
      t.reSetcount()
    }, res2 => {
      console.log(res2)
    })
  },
  //增加数量
  addFn(e) {
    var t = this;
    var _index = e.target.dataset.index;
    var _id = e.target.dataset.id;
    var newData = this.data.caffee_list;
    newData[_index].chekcNum++
    t.setData({
      caffee_list: newData
    })
    this.reSetcount()
  },
  //减少商品数量
  reduceFn(e) {
    var t = this;
    var _index = e.target.dataset.index;
    var _id = e.target.dataset.id;
    var newData = this.data.caffee_list;
    if (newData[_index].chekcNum == 0) {
      return;
    } else {
      newData[_index].chekcNum--;
    }
    t.setData({
      caffee_list: newData
    })
    this.reSetcount()
  },
  //计算数量和价钱
  reSetcount() {
    var count = 0;
    var total = 0;
    var discount = 0;
    var discount_total = 0
    var ginfo = ''
    var json = ''
    var list = this.data.caffee_list;
    for (var i = 0; i < list.length; i++) {
      count += parseInt(list[i].chekcNum)
      total += list[i].chekcNum * list[i].price
      if (list[i].chekcNum != 0) {
        ginfo += list[i].id + ',' + list[i].chekcNum + ',' + list[i].attrid + '|',
          json += list[i].id + ',';
      }
    }
    ginfo = ginfo.substr(0, ginfo.length - 1);
    json = ginfo.substr(0, json.length - 1);
    discount_total = total
    if (this.data.caffeeType == 1) {
      if (count >= 3 && count < 6) {
        discount = (total * 0.1).toFixed(2)
        discount_total = total - discount

      } else if (count >= 6 && count < 9) {
        discount = (total * 0.2).toFixed(2)
        discount_total = total - discount
      } else if (count >= 9) {
        discount = (total * 0.3).toFixed(2)
        discount_total = total - discount
      }
    } else {
      discount = 0
    }
    this.setData({
      total: total,
      count: count,
      discount: discount,
      discount_total: discount_total,
      ginfo: ginfo,
      json: json
    })

  },
  //去结算
  goToOrder() {
    var t = this;
    if (this.data.count == 0) {
      my.alert({
        title: '提示',
        content: '结算订单不能为空!',
        success: function(res) {
          if (res.confirm) {
            return;
          }
        }
      });
    } else {
      fetchApi({
        url: 'Shop/ordersure',
        data: {
          uid: 5579,
          ginfo: t.data.ginfo,
          type: 0
        }
      }, res => {
        if (res.data.status == 0) {
          my.alert({
            title: '提示',
            content: res.data.msg,
            buttonText: '我知道了',
            success: function(res) {
              if (res.confirm) {
                return;
              }
            }
          })
        } else {
          my.navigateTo({
            url: '../orderInfoCar/orderInfoCar?info=' + t.data.ginfo + '&json=' + t.data.json
          })
        }
      }, res2 => {
        console.log(res2)
      })

    }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})