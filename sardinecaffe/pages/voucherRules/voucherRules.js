Page({
  data: {
    voucher: ''
  },
  onLoad: function(opt) {
    if (opt.voucher) {
      my.setNavigationBar({
        title: ["咖啡券", "现金券"][opt.voucher],
      })
      this.setData({
        voucher: opt.voucher
      })
    }
  }
})
