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
      <v-list>
        <range name="Temperature" v-bind:item="item" />
        <range name="Humidity" v-bind:item="item" />
        <range name="Voltage" v-bind:item="item" />
      </v-list>
      <v-list dense style="column-count: 3">
        <v-list-item v-for="(key, index) in item.outlets.currents" :key="index">
          <v-list-item-content>
            <v-col>
              <v-list-item-title
                ><v-icon :color="get_color(index)"
                  >mdi-power-plug-outline</v-icon
                >{{ index }}</v-list-item-title
              >
              <v-list-item-subtitle style="text-align: center">
                {{ item.outlets.voltage }}
                {{
                  item.outlets.voltage !== "?" ? "V" : ""
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
import range from "./range";

export default {
  components: { range },
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
      const username = this.$store.state.account.username.substring(
        0,
        this.$store.state.account.username.indexOf("@")
      );

      for (let i = 0; i < this.item.outlets.currents.length; i++) {
        if (this.outlets.includes(i) && !this.prevOutlets.includes(i))
          command += `1:${i}:${username}/`;
        else if (!this.outlets.includes(i) && this.prevOutlets.includes(i))
          command += `0:${i}:${username}/`;
      }

      const response = await fetch(
        `http://${
          this.$store.state.url
        }:7379/RPUSH/SIMAR:${this.item.parent.replace(" - ", ":")}/${command}`,
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
      // If at least one voltage/current value is critical, display a warning icon
      this.critical =
        (this.outlets.voltage !== "?" && this.outlets.voltage > 240) ||
        this.outlets.voltage < 100 ||
        this.item.outlets.currents.some((current) => {
          return current !== "?" && current > 20;
        });

      if (
        this.item.outlets.voltage > this.item.v_hi ||
        this.item.outlets.voltage < this.item.v_lo ||
        this.item.outlets.currents[index] > 20
      )
        return "red";
      if (
        this.item.outlets.voltage === "?" ||
        this.item.outlets.currents[index] === "?"
      )
        return "grey";
      return "green";
    },
  },
  watch: {
    async dialog() {
      let on_outlets = [];
      let response = await fetch(
        `http://${
          this.$store.state.url
        }:7379/HGET/BBB:${this.item.parent.replace(" - ", ":")}/state_string`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        let data = await response.json();
        this.status = data.HGET;

        response = await fetch(
          `http://${
            this.$store.state.url
          }:7379/SMEMBERS/SIMAR:${this.item.parent.replace(
            " - ",
            ":"
          )}:Outlets`,
          {
            method: "GET",
          }
        );

        if (response.ok && data.SMEMBERS !== null) {
          data = await response.json();
          on_outlets = data.SMEMBERS.map(parseInt);
        }
      }

      this.outlets = this.prevOutlets = on_outlets;
    },
  },
};
</script>
