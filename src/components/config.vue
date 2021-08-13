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
      <v-divider />
      <v-list dense style="column-count: 3">
        <v-list-item v-for="(key, index) in outlets.voltages" :key="index">
          <v-list-item-content>
            <v-col>
              <v-list-item-title
                ><v-icon :color="get_color(index)"
                  >mdi-power-plug-outline</v-icon
                >{{ index }}</v-list-item-title
              >
              <v-list-item-subtitle style="text-align: center">
                {{ outlets.voltages[index] }}
                {{
                  outlets.voltages[index] !== "?" ? "V" : ""
                }}</v-list-item-subtitle
              >
              <v-list-item-subtitle style="text-align: center">
                {{ outlets.currents[index] }}
                {{
                  outlets.currents[index] !== "?" ? "A" : ""
                }}</v-list-item-subtitle
              >
            </v-col>
            <v-col>
              <v-switch x-small inset />
            </v-col>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="apply_changes"
          :disabled="$store.state.accessToken === undefined"
        >
          Apply
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
    async apply_changes() {
        /*
      const token = await this.$store.state.msalInstance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: this.$store.state.account,
      });

      const response = await fetch("http://10.0.38.46:7379/SET/test/1", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });*/

      this.$store.commit(
        "showSnackbar",
        `Successfully applied settings to ${this.name}!`
      );
    },
    get_color(index) {
      this.critical =
        this.outlets.voltages.some((volt) => {
          return volt !== "?" && (volt > 240 || volt < 200);
        }) ||
        this.outlets.currents.some((current) => {
          return current !== "?" && current > 20;
        });

      if (
        this.outlets.voltages[index] > 240 ||
        this.outlets.voltages[index] < 200 ||
        this.outlets.currents[index] > 20
      )
        return "red";
      if (
        this.outlets.voltages[index] === "?" &&
        this.outlets.currents[index] === "?"
      )
        return "grey";
      return "green";
    },
  },
};
</script>
