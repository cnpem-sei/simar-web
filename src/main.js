import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";

Vue.config.productionTip = false;
Vue.prototype.$msalInstance = {};

Vue.mixin({
  methods: {
    async send_command(endpoint, body, method = "POST") {
      let config = {
        method: method,
        headers: { Authorization: `Bearer ${await this.get_token()}`, "Content-Type": "application/json" },
      };

      if (method !== "GET") {
        config["body"] = JSON.stringify(body);
      }

      const response = await fetch(
        `https://${this.$store.state.url}/simar/api/${endpoint}`,
        config,
      );
      return response;
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
