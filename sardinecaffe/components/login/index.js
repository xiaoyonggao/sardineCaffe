const app = getApp()
Component({
  mixins: [],
  data: {},
  props: {},
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 检测是否支持
   _login() {
      app.authUser()
    },
  },
});
