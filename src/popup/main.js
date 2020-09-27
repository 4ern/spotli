import Vue from "vue";
import App from "./App.vue";
import store from "../store/index";
import vuetify from "../plugins/vuetify";
Vue.config.productionTip = false;

/* eslint-disable no-new */
global.vm = new Vue({
  el: "#app",
  vuetify,
  store: store,
  render: h => h(App)
});
