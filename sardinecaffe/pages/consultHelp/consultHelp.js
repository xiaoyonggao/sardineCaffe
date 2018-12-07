import {
  fetchApi
} from '../../utils/util.js';
var wxParse = require('/wxParse/wxParse.js');
const app = getApp();
var _uid, one = false,
  two = true,
  three = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    open_one: true,
    open_two: false,
    open_three: false,
    nodes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  opend_one() {
    two = true
    three = true
    if (one) {
      one = false
      this.setData({
        open_one: true,
        open_two: false,
        open_three: false
      })
    } else {
      one = true
      this.setData({
        open_one: false,
        open_two: false,
        open_three: false
      })
    }
  },
  opend_two() {
    one = true
    three = true
    if (two) {
      two = false
      this.setData({
        open_one: false,
        open_two: true,
        open_three: false
      })
    } else {
      two = true
      this.setData({
        open_one: false,
        open_two: false,
        open_three: false
      })
    }
  },
  opend_three() {
    two = true
    one = true
    if (three) {
      three = false
      this.setData({
        open_one: false,
        open_two: false,
        open_three: true
      })
    } else {
      three = true
      this.setData({
        open_one: false,
        open_two: false,
        open_three: false
      })
    }


  },
  onLoad: function(options) {
    var t = this;
    t.getHelpList()
  },
  //获取常见问题list
  getHelpList() {
    var t = this
    var nodes_text =[]
    fetchApi({
      url: 'Common/getHelpList',
      data: {
      pagenum: 1,
      pagesize: 999,
      }
    }, res => {
        var dataList = res.data.data.map((item) => {
        return Object.assign(item, {}, {
          shows: false
        })
      })
      for(var i = 0; i<dataList.length;i++){
        wxParse.wxParse(dataList[i].contents, 'html', dataList[i].contents, t, 5)
      }
      t.setData({
        list: dataList
      })
      //  console.log("nodes_text",nodes_text)
    }, res2 => {
      console.log(res2)
    })
  }
})