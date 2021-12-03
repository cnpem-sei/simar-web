<template>
  <v-app>
    <v-main fluid>
      <Toolbar
        @sort="update_sort"
        @desc="update_desc"
        @search="update_search"
        v-bind:settings="settings"
      />
      <Iterator v-bind:settings="settings" />
    </v-main>
    <Footer />

    <v-snackbar
      v-model="$store.state.snackbar"
      timeout="4000"
      color="white"
      light
    >
      {{ $store.state.message }}

      <template v-slot:action="{ attrs }">
        <v-btn icon text v-bind="attrs" @click="$store.commit('hideSnackbar')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import Iterator from "./components/Iterator";
import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";

import { PublicClientApplication } from "@azure/msal-browser";

function getInitials(account) {
  return account.name.split(" ")[0].substring(0, 1);
}

export default {
  name: "SIMAR",
  components: {
    Toolbar,
    Iterator,
    Footer,
  },
  data: () => ({
    settings: {
      sort_desc: false,
      sort_by: "Name",
      search: "",
      keys: ["Name", "Temperature", "Pressure", "Rack Open", "Humidity"],
      pvs: {},
    },
  }),

  methods: {
    update_search: function (value) {
      this.settings.search = value;
    },
    update_desc: function (value) {
      this.settings.sort_desc = value;
    },
    update_sort: function (value) {
      this.settings.sort_by = value;
    },
  },
  created() {
    const msalInstance = new PublicClientApplication(
      this.$store.state.msalConfig
    );

    this.$store.commit("setInstance", msalInstance);

    const accounts = this.$store.state.msalInstance.getAllAccounts();

    if (accounts.length == 0) return;
    accounts[0].initials = getInitials(accounts[0]);
    this.$store.commit("setAccount", accounts[0]);
  },
};
</script>

<style scoped>
.v-main {
  background: rgb(1, 45, 87);
}
</style>