<template>
  <v-col>
    <v-menu
      v-if="$store.state.account"
      bottom
      min-width="300px"
      rounded
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn icon x-large v-on="on">
          <v-avatar color="indigo" size="48">
            <span class="white--text text-h6">{{
              $store.state.account.initials
            }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-list-item-content class="justify-center">
          <div class="mx-auto text-center">
            <v-avatar color="indigo" style="margin-bottom: 10px">
              <span class="white--text text-h6">{{
                $store.state.account.initials
              }}</span>
            </v-avatar>
            <h3>{{ $store.state.account.name }}</h3>
            <p class="text-caption mt-1">{{ $store.state.account.username }}</p>
            <v-divider class="my-3"></v-divider>
            <v-btn @click="unsubscribe_all" depressed text>
              <v-icon style="margin-right: 10px">mdi-bell-off-outline</v-icon
              >Unsubscribe to all</v-btn
            >
            <v-divider class="my-3"></v-divider>
            <v-btn @click="logout" depressed text> Disconnect </v-btn>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>
    <v-menu
      :close-on-content-click="false"
      v-else
      bottom
      min-width="200px"
      rounded
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          :disabled="!$store.state.msalConfig.auth.authority"
          @click="login"
          icon
          x-large
          v-on="on"
        >
          <v-icon>mdi-login</v-icon>
        </v-btn>
      </template>
    </v-menu>
  </v-col>
</template>

<script>
import { PublicClientApplication } from "@azure/msal-browser";

function getInitials(account) {
  return account.name.split(" ")[0].substring(0, 1);
}

export default {
  async created() {
    const msalInstance = new PublicClientApplication(
      this.$store.state.msalConfig
    );

    this.$store.commit("setInstance", msalInstance);
  },
  async mounted() {
    const accounts = this.$store.state.msalInstance.getAllAccounts();
    if (accounts.length == 0) {
      return;
    }
    accounts[0].initials = getInitials(accounts[0]);
    this.$store.commit("setAccount", accounts[0]);
  },
  methods: {
    async login() {
      await this.$store.state.msalInstance
        .loginPopup({})
        .then(() => {
          const accounts = this.$store.state.msalInstance.getAllAccounts();
          accounts[0].initials = getInitials(accounts[0]);
          this.$store.commit("setAccount", accounts[0]);
        })
        .catch((error) => {
          console.error(`Error during authentication: ${error}`);
        });
      this.$store.commit(
        "showSnackbar",
        `Logged in as ${this.$store.state.account.username}`
      );
    },
    async logout() {
      await this.$store.state.msalInstance.logout({}).catch((error) => {
        console.error(error);
      });
    },
    async unsubscribe_all() {
      const subscription =
        await this.$store.state.sw.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      await fetch(`https://127.0.0.1:5000/simar/api/unsubscribe_all`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${await this.get_token()}`,
          "Content-Type": "application/json",
        },
      });
    },
  },
};
</script>