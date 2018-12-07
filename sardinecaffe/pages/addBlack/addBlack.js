import {
  fetchApi,
  getStorageSync
} from '../../utils/util.js';
const app = getApp()
var _uid = '',pages ='';
Page({
  data: {
    getUserlistArr: [],
    keyword: '',
    checkArr: [],
    myUid: ''
  },
  addBlack() {
    if (this.data.checkArr.length == 0) {
      my.showModal({
        content: '未选择任何人',
        showCancel: false,
        success: function(res) {

        }
      });
    } else {
      fetchApi({
        url: 'User/doBlack',
        data: {
          uid: '5579',
          touid: this.data.checkArr.join(','),
          type: 1
        }
      }, res => {
        if (res.data.status == 1) {
          my.alert({
            title:'提示',
            content: '添加成功',
            success: function(res) {
              pages[pages.length-2].getBlacklist()
                my.navigateBack({
                  delta: 1
                })
             }
          });
        } else {
          my.alert({
            title:'提示',
            content: res.msg,
            success: function(res) {
             }
          });
        }
      }, res2 => {
        console.log(res2)
      })
    }


  },
  checkboxChange(e) {
    this.setData({
      checkArr: e.detail.value
    })
  },
  removeKey() {
    this.setData({
      keyword: ''
    });
  },
  changeVal(e) {
    this.setData({
      keyword: e.detail.value
    });
  },
  searchFn() {
    this.getUserlist()
  },
  onLoad() {
    var userData = getStorageSync('userData');
    _uid = userData.id;
    this.setData({
      myUid: _uid
    });
    pages = getCurrentPages()
    this.getUserlist()
  },
  attendFn(e) {
    var t = this;
    var _index = e.target.dataset.index;
    var _fid = e.target.dataset.id
    if (this.data.getUserlistArr[_index].is_attend) {
      fetchApi({
        url: 'User/doAttend',
        data: {
          uid: _uid,
          fid: _fid,
          type: 0
        }
      }, res => {
        var newData = t.data.getUserlistArr;
        newData[_index].is_attend = 0
        t.setData({
          getUserlistArr: newData
        });
        console.log(res)
      }, res2 => {
        console.log(res2)
      })

    } else {
      fetchApi({
        url: 'User/doAttend',
        data: {
          uid: _uid,
          fid: _fid,
          type: 1
        }
      }, res => {
        var newData = t.data.getUserlistArr;
        newData[_index].is_attend = 1
        t.setData({
          getUserlistArr: newData
        });
        console.log(res)
      }, res2 => {
        console.log(res2)
      })
    }
  },
  getUserlist() {
    var t = this;
     fetchApi({
      url: 'User/getUserlist',
      data: {
        uid: _uid,
        keyword: t.data.keyword,
        pagenum: 1,
        pagesize: 99999
      }
    }, res => {
      t.setData({
        getUserlistArr: res.data.data || []
      })
      console.log(res.data.data)
    }, res2 => {
      console.log(res2)
    })

  }
})
