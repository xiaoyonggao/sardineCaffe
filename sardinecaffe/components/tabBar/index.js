const app = getApp();
Component({
  mixins: [],
  data: {},
  props: {
    currentPage:1,
    isIpx:''
  },
  didMount() {
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
    }
  }
});
