import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";

Vue.config.productionTip = false;
Vue.prototype.$msalInstance = {};

Vue.mixin({
  methods: {
    async send_command(cmd, use_token = false) {
      let headers = {};
      if (use_token) headers = { Authorization: `Bearer ${await this.get_token()}` };
      const response = await fetch(
        `https://${this.$store.state.url}/archiver-generic-backend/bypass?${this.$store.state.url}:7379/${cmd}`,
        {
          method: "GET",
          headers: headers,
        }
      );
      return response.json();
    },
    async get_token() {
      const token = await this.$store.state.msalInstance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: this.$store.state.account,
      });

      return token.accessToken;
    }
  },
});

new Vue({
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
