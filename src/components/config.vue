<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        small
        fab
        color="grey"
        v-bind="attrs"
        v-on="on"
        :disabled="$store.state.account === undefined"
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
        <range
          name="Temperature"
          v-bind:item="item"
          @change="
            (e) => {
              range.t = e;
            }
          "
        />
        <range
          name="Humidity"
          v-bind:item="item"
          @change="
            (e) => {
              range.h = e;
            }
          "
        />
        <range
          name="Voltage"
          v-bind:item="item"
          @change="
            (e) => {
              range.v = e;
            }
          "
        />
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
                {{ item.pvs.Voltage.value }}</v-list-item-subtitle
              >
              <v-list-item-subtitle style="text-align: center">
                {{ item.outlets.currents[index] }}</v-list-item-subtitle
              >
            </v-col>
            <v-col>
              <v-switch v-model="outlets" :value="index" color="green" inset />
            </v-col>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-checkbox
          v-model="autotemp"
          label="Stabilize Temperatures"
          color="green"
        />
        <v-spacer />
        <v-btn color="grey darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="apply_changes"> Apply </v-btn>
      </v-card-actions>
      <v-progress-linear
        :active="load_prog !== 0"
        :value="load_prog"
        absolute
        bottom
        color="blue accent-4"
      ></v-progress-linear>
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
      autotemp: false,
      range: { h: [0, 0], t: [0, 0], v: [0, 0] },
      load_prog: 0,
      parent_name: "",
    };
  },
  methods: {
    async apply_changes() {
      let command = "";
      const username = this.$store.state.account.username.substring(
        0,
        this.$store.state.account.username.indexOf("@")
      );

      this.load_prog = 33;

      for (let i = 0; i < this.item.outlets.currents.length; i++) {
        if (this.outlets.includes(i) && !this.prevOutlets.includes(i))
          command += `/${i}/1:${username}`;
        else if (!this.outlets.includes(i) && this.prevOutlets.includes(i))
          command += `/${i}/0:${username}`;
      }

      const pv_prefix = this.item.pvs.Temperature.name.substring(
        0,
        this.item.pvs.Temperature.name.lastIndexOf(":")
      );
      await this.send_command(
        `HSET/SIMAR:${pv_prefix}:Limits/h_hi/${this.range.h[1]}/h_lo/${this.range.h[0]}/t_hi/${this.range.t[1]}/t_lo/${this.range.t[0]}/v_hi/${this.range.v[1]}/v_lo/${this.range.v[0]}`,
        true
      );

      this.load_prog = 80;

      await this.send_command(`HSET/SIMAR:${this.parent_name}${command}`, true);

      this.$store.commit(
        "showSnackbar",
        `Successfully applied settings to ${this.item.parent}!`
      );

      this.dialog = false;
      this.load_prog = 0;
    },
    get_color(index) {
      if (
        this.item.outlets.voltage === "?" ||
        this.item.outlets.currents[index] === "?"
      )
        return "grey";
      if (
        this.item.outlets.voltage > this.item.v_hi ||
        this.item.outlets.voltage < this.item.v_lo ||
        this.item.outlets.currents[index] > 20
      )
        return "red";

      return "green";
    },
  },
  watch: {
    async dialog() {
      let on_outlets = [];
      this.parent_name = this.item.parent.replace(" - ", ":");
      let data = await this.send_command(
        `HGET/BBB:${this.parent_name}/state_string`
      );

      if (data) {
        this.status = data.HGET;

        data = await this.send_command(`HGETALL/SIMAR:${this.parent_name}:RB`);

        console.log(data.HGETALL);

        for (let i = 0; i < 7; i += 2) {
          if (data.HGETALL[i] === "1") on_outlets.push(i);
        }
      }
      data = await this.send_command(
        `HGET/SIMAR:${this.parent_name}/AT:${this.item.outlets.number}`
      );
      this.outlets = this.prevOutlets = on_outlets;
    },
  },
};
</script>
