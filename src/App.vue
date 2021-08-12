<template>
  <v-app>
    <v-main fluid>
      <toolbar
        @sort="updateSort"
        @desc="updateDesc"
        @search="updateSearch"
        @logout="logout"
        @login="login"
        v-bind:settings="settings"
        v-bind:account="account"
      />
      <iterator v-bind:settings="settings" />
    </v-main>
    <ft />

    <v-snackbar v-model="snackbar" timeout="4000" color="white" light>
      {{ snackbar_text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { PublicClientApplication } from "@azure/msal-browser";
import iterator from "./components/iterator";
import toolbar from "./components/toolbar";
import ft from "./components/footer";

export default {
  name: "App",
  components: {
    toolbar,
    iterator,
    ft,
  },
  data: () => ({
    settings: {
      sortDesc: false,
      sortBy: "Name",
      search: "",
      keys: [
        "Name",
        "Temperature",
        "Pressure",
        "Rack open",
        "Fan speed",
        "Humidity",
      ],
      pvs: {},
    },
    account: undefined,
    snackbar_text: "Testing text",
    snackbar: true,
  }),
  async created() {
    const msalInstance = new PublicClientApplication(
      this.$store.state.msalConfig
    );

    this.$store.commit("setInstance", msalInstance);
  },
  mounted() {
    const accounts = this.$store.state.msalInstance.getAllAccounts();
    if (accounts.length == 0) {
      return;
    }
    accounts[0].initials = this.getInitials(accounts[0]);
    this.$store.commit("setAccount", accounts[0]);
  },

  methods: {
    updateSearch: function (value) {
      this.settings.search = value;
    },
    updateDesc: function (value) {
      this.settings.sortDesc = value;
    },
    updateSort: function (value) {
      this.settings.sortBy = value;
    },

    getInitials(account) {
      return account.name.split(" ")[0].substring(0, 1);
    },
    showSnackbar(text) {
      this.snackbar_text = text;
      this.snackbar = true;
    },
    async login() {
      await this.$store.state.msalInstance
        .loginPopup({})
        .then(() => {
          const accounts = this.$store.state.msalInstance.getAllAccounts();
          accounts[0].initials = this.getInitials(accounts[0]);
          this.$store.commit("setAccount", accounts[0]);
        })
        .catch((error) => {
          console.error(`error during authentication: ${error}`);
        });
      this.showSnackbar(`Logged in as ${this.$store.state.account.username}`);
    },
    async logout() {
      await this.$store.state.msalInstance.logout({}).catch((error) => {
        console.error(error);
      });
    },
  },
};
</script>

<style scoped>
.v-main {
  background: rgb(1, 45, 87);
}
</style>