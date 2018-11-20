import {
  fetchApi
} from '../../utils/util.js';
const app = getApp()
Page({
  data: {
    longitude: '',
    latitude: '',
    markers: [],
    circles: [],
    scale: '14'
  },
  onLoad: function() {
    var t = this;
    my.getLocation({
      type: 0, // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 my.openLocation 的坐标
      success: function(res) {
        t.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          circles: [{
            latitude: res.latitude,
            longitude: res.longitude,
            color: '',
            fillColor: '#7cb5ec88',
            radius: 1000,
            strokeWidth: 1
          }]
        });
        t.getList();
      }
    })
  },
  changeMap(e) {
    console.log("ewww",e)
    if (e.type == 'end') {
      // this.getList();
    }
  },
  getList() {
    var t = this;
    fetchApi({
      url: 'Common/nearby1',
      data: {
        posxy: t.data.latitude + ',' + t.data.longitude,
        pagenum: 1,
        pagesize: 999
      }
    }, res => {
      var _arr = []
      console.log("Common/nearby1", res)
      if (res.data.data.length) {
        res.data.data.map(function(o) {
          _arr.push({
            iconPath: "/img/map.png",
            id: o.id,
            latitude: o.posx,
            longitude: o.posy,
            width: 26,
            title: o.title,
            distance: o.distance,
            provincename: o.provincename,
            cityname: o.cityname,
            areaname: o.areaname,
            address: o.address,
            height: 26,
            anchorX: 0.5,
            anchorY: 0.5
          })
          t.setData({
            markers: _arr
          })
        })
      }
    }, res2 => {
      console.log(res2)
    })

  }
})
