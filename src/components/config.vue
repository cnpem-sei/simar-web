<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon small fab color="grey" v-bind="attrs" v-on="on"
        ><v-icon dark>mdi-cog</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ name }}</span>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="apply_changes"
          :disabled="$store.state.accessToken === undefined"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["name", "outlets"],
  data: function () {
    return {
      dialog: false,
    };
  },
  methods: {
    apply_changes() {
      this.$store.state.msalInstance
        .acquireTokenSilent({
          scopes: ["User.Read"],
          account: this.$store.state.account,
        })
        .then(function (accessTokenResponse) {
          this.$store.state.commit(
            "setAccessToken",
            accessTokenResponse.accessToken
          );
        });
    },
  },
};
</script>
