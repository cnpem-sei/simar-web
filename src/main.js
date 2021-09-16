import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";

Vue.config.productionTip = false;
Vue.prototype.$msalInstance = {};

Vue.mixin({
  methods: {
    async send_command(cmd, token = "") {
      const response = await fetch(
        `https://${this.$store.state.url}/archiver-generic-backend/bypass?${this.$store.state.url}:7379/${cmd}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
      return response.json();
    },
  },
});

new Vue({
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
