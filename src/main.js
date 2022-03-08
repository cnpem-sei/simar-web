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

      if (method === "POST") {
        config["body"] = JSON.stringify(body);
      }

      const response = await fetch(
        `https://${this.$store.state.url}/simar/api/${endpoint}`,
        config,
      );

      return response;
    },
    async get_token() {
      let token;
      try {
        token = await this.$store.state.msalInstance.acquireTokenSilent({
          scopes: ["User.Read"],
          account: this.$store.state.account,
        });
      } catch (err) {
        console.error(err);
        token = await this.$store.state.msalInstance.acquireTokenPopup({
          scopes: ["User.Read"],
          account: this.$store.state.account,
        });
      }

      return token.accessToken;
    },
    b64_uint8(b64_string) {
      const padding = "=".repeat((4 - (b64_string.length % 4)) % 4);
      const base64 = (b64_string + padding).replace(/-/g, "+").replace(/_/g, "/");

      const raw_data = window.atob(base64);
      const output_arr = new Uint8Array(raw_data.length);

      for (let i = 0; i < raw_data.length; ++i) {
        output_arr[i] = raw_data.charCodeAt(i);
      }
      return output_arr;
    }
  },
});

new Vue({
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
