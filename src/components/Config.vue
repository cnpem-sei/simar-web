<template>
  <v-dialog v-model="dialog" max-width="700px">
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
        <Range
          name="Temperature"
          v-bind:item="item"
          @change="
            (e) => {
              range.Temperature = e;
            }
          "
        />
        <Range
          name="Humidity"
          v-bind:item="item"
          @change="
            (e) => {
              range.Humidity = e;
            }
          "
        />
        <Range
          name="Voltage"
          v-bind:item="item"
          @change="
            (e) => {
              range.Voltage = e;
            }
          "
        />
        <Range
          name="Pressure"
          v-bind:item="item"
          @change="
            (e) => {
              range.Pressure = e;
            }
          "
        />
      </v-list>
      <v-list dense style="column-count: 3">
        <v-list-item
          v-for="(key, index) in item.pvs.Current.values"
          :key="index"
        >
          <v-list-item-content>
            <v-row>
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
                  {{ item.pvs.Current.values[index] }}</v-list-item-subtitle
                >
              </v-col>
              <v-col>
                <v-switch
                  v-model="outlets"
                  :value="index"
                  color="green"
                  inset
                />
              </v-col>
            </v-row>
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
import Range from "./Range";

export default {
  components: { Range },
  props: ["item"],
  data: function () {
    return {
      dialog: false,
      status: "Connected",
      prevOutlets: [],
      outlets: [],
      autotemp: false,
      range: {
        Humidity: [0, 0],
        Temperature: [0, 0],
        Pressure: [0, 0],
        Voltage: [0, 0],
      },
      load_prog: 0,
      parent_name: "",
    };
  },
  methods: {
    async apply_changes() {
      this.load_prog = 33;

      const outlets = [];

      for (let i = 0; i < this.item.pvs.Current.values.length; i++)
        outlets.push(this.outlets.includes(i) ? 1 : 0);

      const pvs_to_change = [];

      for (let pv of Object.keys(this.item.pvs)) {
        if (!this.item.pvs[pv].name) continue;
        if (
          this.range[pv] !== undefined &&
          this.range[pv][0] !== this.range[pv][1] &&
          (this.range[pv][0] !== this.item.pvs[pv].lo_limit ||
            this.range[pv][1] !== this.item.pvs[pv].hi_limit)
        ) {
          pvs_to_change.push({
            name: this.item.pvs[pv].name,
            lo_limit: this.range[pv][0],
            hi_limit: this.range[pv][1],
          });
        }
      }

      await fetch(`https://${this.$store.state.url}/simar/api/set_limits`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${await this.get_token()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pvs: pvs_to_change }),
      });

      this.$emit("update-limit", pvs_to_change);

      this.load_prog = 80;

      await fetch(
        `https://${this.$store.state.url}/simar/api/outlets?host=SIMAR:${this.parent_name}`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${await this.get_token()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ outlets: outlets }),
        }
      );

      this.$store.commit(
        "showSnackbar",
        `Successfully applied settings to ${this.item.parent}!`
      );

      this.dialog = false;
      this.load_prog = 0;
    },
    get_color(index) {
      if (
        this.item.pvs.Voltage.value === "?" ||
        this.item.pvs.Current.values[index] === "?"
      )
        return "grey";
      if (
        this.item.pvs.Voltage.value > this.item.v_hi ||
        this.item.pvs.Voltage.value < this.item.v_lo ||
        this.item.pvs.Current.values[index] > 20
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

        data = await fetch(
          `https://${this.$store.state.url}/simar/api/outlets?host=SIMAR:${this.parent_name}`,
          {
            method: "get",
            headers: {
              Authorization: `Bearer ${await this.get_token()}`,
            },
          }
        );

        data = await data.json();

        for (let i in data.outlets)
          if (data.outlets[i] === 1) on_outlets.push(parseInt(i));
      }

      this.outlets = this.prevOutlets = on_outlets;
    },
  },
};
</script>
