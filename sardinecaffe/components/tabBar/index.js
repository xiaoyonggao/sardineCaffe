const app = getApp();
Component({
  mixins: [],
  data: {
    isIpx:app.globalData.iPhonex
  },
  props: {
    currentPage:1,
    isIpx:''
  },
  didMount() {
    console.log("isIpx",this.data.isIpx)
  },
  didUpdate() {
  },
  didUnmount() {
  },
  methods: {
    _goRedirect(e){ 
      var currentpage = parseInt(e.currentTarget.dataset.currentPage) 
      var num = parseInt(e.currentTarget.dataset.num) 
      if (num == currentpage){
        return;
      }else{
        switch (num) {
          case 1:
            my.redirectTo({
              url: '../home/home'
            })
            break;
          case 2:
            my.redirectTo({
              url: '../userCenter/userCenter'
            })
            break;
          default:
             return;
        }
      }
    },
    scanCode(){
      app.scanCode()
    }
  }
});
