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
        ><v-icon dark>{{ mdiCog }}</v-icon></v-btn
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
          >{{ mdiWifi }}</v-icon
        >
        <v-icon v-if="status === 'Connected'" color="green">{{
          mdiLanConnect
        }}</v-icon>
        <v-icon v-else color="red">{{ mdiLanDisconnect }}</v-icon>
      </v-card-title>
      <v-card-subtitle style="padding-bottom: 5px">
        {{ item.parent }}
      </v-card-subtitle>
      <v-divider />
      <v-list>
        <limit-range
          name="Temperature"
          v-bind:item="item"
          @change="
            (e) => {
              range.Temperature = e;
            }
          "
        />
        <limit-range
          name="Humidity"
          v-bind:item="item"
          @change="
            (e) => {
              range.Humidity = e;
            }
          "
        />
        <limit-range
          name="Voltage"
          v-bind:item="item"
          @change="
            (e) => {
              range.Voltage = e;
            }
          "
        />
        <limit-range
          name="Pressure"
          v-bind:item="item"
          @change="
            (e) => {
              range.Pressure = e;
            }
          "
        />
      </v-list>
      <v-container>
        <v-row>
          <v-col v-for="(column, index) in columns" :key="index">
            <v-list dense>
              <v-list-item v-for="(key, index) in column" :key="index">
                <v-list-item-content>
                  <v-row>
                    <v-col>
                      <v-list-item-title
                        ><v-icon :color="get_color(index)">{{
                          mdiPowerPlugOutline
                        }}</v-icon
                        >{{ key }}</v-list-item-title
                      >
                      <v-list-item-subtitle style="text-align: center">
                        {{ item.pvs.Voltage.value }}</v-list-item-subtitle
                      >
                      <v-list-item-subtitle style="text-align: center">
                        {{ item.pvs.Current.values[key] }}</v-list-item-subtitle
                      >
                    </v-col>
                    <v-col>
                      <v-switch
                        v-model="outlets"
                        :value="key"
                        color="green"
                        inset
                        :disabled="loading_pv"
                      />
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
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
import LimitRange from "./LimitRange";
import {
  mdiWifi,
  mdiLanConnect,
  mdiLanDisconnect,
  mdiCog,
  mdiPowerPlugOutline,
} from "@mdi/js";

async function fetch_timeout(resource, options = {}) {
  const { timeout = 1000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

export default {
  components: { LimitRange },
  props: ["item"],
  data: function () {
    return {
      dialog: false,
      status: "Connected",
      loading_pv: true,
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
      mdiCog,
      mdiPowerPlugOutline,
      mdiWifi,
      mdiLanConnect,
      mdiLanDisconnect,
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

      await this.send_command("set_limits", { pvs: pvs_to_change });

      this.$emit("update-limit", pvs_to_change);

      this.load_prog = 80;

      await this.send_command(`outlets?host=SIMAR:${this.parent_name}`, {
        outlets: outlets,
      });

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
      this.loading_pv = true;
      let on_outlets = [];
      this.parent_name = this.item.parent.replace(" - ", ":");

      try {
        await fetch_timeout(
          `https://${this.$store.state.url}/archiver-generic-backend/bypass?${this.$store.state.url}:7379/HGET/BBB:${this.parent_name}/state_string`
        );
        this.status = data.HGET;
      } catch (err) {
        this.status = "Connected";
        console.warn(err);
      }

      let data = await this.send_command(
        `outlets?host=SIMAR:${this.parent_name}`,
        {},
        "GET"
      );
      data = await data.json();

      for (let i in data.outlets)
        if (data.outlets[i] === 1) on_outlets.push(parseInt(i));

      this.outlets = on_outlets;
      this.loading_pv = false;
    },
  },
  computed: {
    columns() {
      const column_count = this.$vuetify.breakpoint.mobile ? 1 : 3;
      let columns = [];
      let mid = Math.ceil(7 / column_count);
      for (let col = 0; col < column_count; col++) {
        columns.push([...Array(7).keys()].slice(col * mid, col * mid + mid));
      }
      return columns;
    },
  },
};
</script>
