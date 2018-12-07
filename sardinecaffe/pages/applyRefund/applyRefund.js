import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
const app = getApp();
Page({
  data: { 
    orderdetail: '',
    goodsList: [],
    backReason: '',
    money: '',
    inputTxt: '',
    textarea: '',
    disabled: false,
    Refundprice: 0,
    showBtn: false
  },
  onLoad: function(options) {
    var item = JSON.parse(options.orderdetail),
      goodsList = item.goodsinfo;
    console.log("optionsoptions", item)
      goodsList.map((item) => {
      item.checkNum = item.num, 
      item.check = false
    })
    this.setData({
      orderdetail: item,
      goodsList: goodsList,
      money: item.money
    })
  },
  setRefundPrice() {
    var newData = this.data.goodsList.filter((item) => {
      return item.check == true
    })
    var showBtn = '' , Refundprice = 0;
    newData.length != 0 ? showBtn = true : showBtn = false
    this.setData({
      showBtn: showBtn
    })
   for (var i = 0; i < newData.length; i++) {
     Refundprice += parseFloat(newData[i].checkNum) * parseFloat(newData[i].real_price)
    }
    Refundprice = Refundprice.toFixed(2)
    this.setData({
      Refundprice: Refundprice
    })
    
  },
  reduce_num(e) {
    var _index = e.target.dataset.index,
      newData = this.data.goodsList;
    if (newData[_index].checkNum == 1) {
      my.alert({
        title: '提示',
        content: '数量不能小于购买数量',
        success: function(res) {
           return;
           }
      })
    } else {
      newData[_index].check = true
      newData[_index].checkNum--;

    }
    this.setData({
      goodsList: newData
    })
    this.setRefundPrice()
  },
  add_num(e) {
    var _index = e.target.dataset.index,
      newData = this.data.goodsList;
    if (newData[_index].checkNum == newData[_index].num) {
      console.log("eeee2")
      my.alert({
        title: '提示',
        content: '数量不能大于购买数量',
        success: function(res) {
            return;
        }
      })
    } else {
      newData[_index].check = true
      newData[_index].checkNum++;
    }
    this.setData({
      goodsList: newData
    })
    this.setRefundPrice()
  },
  check_good(e) {
    var _index = e.currentTarget.dataset.index,
      newData = this.data.goodsList;
    newData[_index].check ? newData[_index].check = false : newData[_index].check = true;
    this.setData({
      goodsList: newData
    })
    this.setRefundPrice()
  },
  cancel() {
    my.navigateBack({
      delta: 1,
    })
  },
  sure() {
    var newData = this.data.goodsList.filter((item) => {
      return item.check == true
    })
    var info ='',refundPrice = 0;
    if (newData.length != 0) {
      for(var i=0; i<newData.length;i++){
        info += newData[i].name + ',' + newData[i].price + ',' + newData[i].checkNum + ',' + newData[i].img+ '|',
        refundPrice += parseFloat(newData[i].checkNum) * parseFloat(newData[i].real_price)
      }
      refundPrice = refundPrice.toFixed(2)
      info = info.substr(0, info.length - 1);
      my.navigateTo({
        url: '../refundUpData/refundUpData?info=' + info + '&refundPrice=' + refundPrice + '&orderno=' + this.data.orderdetail.orderno
      })
    }else{
      my.alert({
        title: '提示',
        content: '请选择退款商品',
        success: function (res) {
          if (res.confirm) {
           return;
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  }
})