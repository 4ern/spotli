import Vue from "vue";
import App from "./App.vue";
import store from "../store/index"

/* eslint-disable no-new */
global.vm = new Vue({
  el: "#app",
  store: store,
  render: h => h(App)
});

