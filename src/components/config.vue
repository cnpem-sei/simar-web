<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon small fab color="grey" v-bind="attrs" v-on="on"
        ><v-icon dark>mdi-cog</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ item.name }}</span>
        <v-spacer />
        <v-icon
          v-if="item.parent.substring(0, 5) === '10.15'"
          style="margin-right: 10px"
          color="grey"
          >mdi-wifi</v-icon
        >
        <v-icon v-if="status === 'Connected'" color="green"
          >mdi-lan-connect</v-icon
        >
        <v-icon v-else color="red">mdi-lan-disconnect</v-icon>
      </v-card-title>
      <v-card-subtitle style="padding-bottom: 5px">
        {{ item.parent }}
      </v-card-subtitle>
      <v-divider />
      <v-list dense style="column-count: 3">
        <v-list-item v-for="(key, index) in item.outlets.voltages" :key="index">
          <v-list-item-content>
            <v-col>
              <v-list-item-title
                ><v-icon :color="get_color(index)"
                  >mdi-power-plug-outline</v-icon
                >{{ index }}</v-list-item-title
              >
              <v-list-item-subtitle style="text-align: center">
                {{ item.outlets.voltages[index] }}
                {{
                  item.outlets.voltages[index] !== "?" ? "V" : ""
                }}</v-list-item-subtitle
              >
              <v-list-item-subtitle style="text-align: center">
                {{ item.outlets.currents[index] }}
                {{
                  item.outlets.currents[index] !== "?" ? "A" : ""
                }}</v-list-item-subtitle
              >
            </v-col>
            <v-col>
              <v-switch v-model="outlets" :value="index" color="green" inset />
            </v-col>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="apply_changes"
          :disabled="
            $store.state.account === undefined || prevOutlets === outlets
          "
        >
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["item"],
  data: function () {
    return {
      dialog: false,
      status: "Connected",
      prevOutlets: [],
      outlets: [],
    };
  },
  methods: {
    async apply_changes() {
      const token = await this.$store.state.msalInstance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: this.$store.state.account,
      });

      let command = "";
      const username = this.$store.state.account.username.substring(0, this.$store.state.account.username.indexOf("@"));

      for (let i = 0; i < this.item.outlets.voltages.length; i++) {
        if (this.outlets.includes(i) && !this.prevOutlets.includes(i))
          command += `1:${i}:${username}/`;
        else if (!this.outlets.includes(i) && this.prevOutlets.includes(i))
          command += `0:${i}:${username}/`;
      }

      const response = await fetch(
        `http://10.0.38.46:7379/RPUSH/SIMAR:${this.item.parent.replace(
          " - ",
          ":"
        )}/${command}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );

      if (response.ok) {
        this.$store.commit(
          "showSnackbar",
          `Successfully applied settings to ${this.item.parent}!`
        );
      }

      this.dialog = false;
    },
    get_color(index) {
      this.critical =
        this.item.outlets.voltages.some((volt) => {
          return volt !== "?" && (volt > 240 || volt < 200);
        }) ||
        this.item.outlets.currents.some((current) => {
          return current !== "?" && current > 20;
        });

      if (
        this.item.outlets.voltages[index] > 240 ||
        this.item.outlets.voltages[index] < 200 ||
        this.item.outlets.currents[index] > 20
      )
        return "red";
      if (
        this.item.outlets.voltages[index] === "?" &&
        this.item.outlets.currents[index] === "?"
      )
        return "grey";
      return "green";
    },
  },
  watch: {
    async dialog() {
      const response = await fetch(
        `http://10.0.38.46:7379/HGET/BBB:${this.item.parent.replace(
          " - ",
          ":"
        )}/state_string`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.HGET !== null) this.status = data.HGET;
      }
      const on_outlets = [];

      for (let i = 0; i < this.item.outlets.voltages.length; i++)
        if (this.item.outlets.voltages[i] > 1) on_outlets.push(i);

      this.outlets = this.prevOutlets = on_outlets;
    },
  },
};
</script>
