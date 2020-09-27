import '@mdi/font/css/materialdesignicons.css'
import Vue from "vue";
import Vuetify from "vuetify/lib";
Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#009DAF',
                background: '#303038'
            }
        }
    },
});
