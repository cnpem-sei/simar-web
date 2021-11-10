<template>
  <v-container fluid>
    <v-data-iterator
      :items="filter_valid"
      :items-per-page.sync="items_per_page"
      :page.sync="page"
      :search="this.settings.search"
      :sort-by="this.settings.sort_by"
      :sort-desc="this.settings.sort_desc"
      :custom-sort="num_sort"
      hide-default-footer
    >
      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <card
              :key="item.name"
              v-bind:item="item"
              v-bind:keys="settings.keys"
              v-bind:filtered_keys="filtered_keys"
              @update-sub="update_sub(item, $event)"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-row class="mt-2 no-margin" align="center" justify="center">
          <span class="text-button white--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="white"
                class="ml-2 blue-background"
                v-bind="attrs"
                v-on="on"
              >
                {{ items_per_page }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in [8, 12, 16, 20]"
                :key="index"
                @click="items_per_page = number"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer />

          <v-layout
            v-if="items.length"
            align-center
            justify-center
            class="hidden-sm-and-down"
          >
            <div class="text-button amb-val">Ambient</div>
            <v-btn
              plain
              class="amb-val"
              :href="`https://${$store.state.url}/archiver-viewer/?pv=`"
              ><v-icon dark>mdi-thermometer</v-icon
              >{{ items.at(-1).pvs.Temperature.value }}</v-btn
            >
            <v-btn
              plain
              class="amb-val"
              :href="`https://${$store.state.url}/archiver-viewer/?pv=`"
              ><v-icon dark>mdi-gauge</v-icon
              >{{ items.at(-1).pvs.Pressure.value }}</v-btn
            >
            <v-btn
              plain
              class="amb-val"
              :href="`https://${$store.state.url}/archiver-viewer/?pv=`"
              ><v-icon dark>mdi-water-percent</v-icon
              >{{ items.at(-1).pvs.Humidity.value }}</v-btn
            >
          </v-layout>

          <v-spacer />

          <span class="text-button mr-4 white--text">
            Page {{ page }} of {{ number_pages }}
          </span>
          <v-btn
            dark
            color="blue darken-3"
            class="mr-1"
            @click="if (page - 1 >= 1) page -= 1;"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            dark
            color="blue darken-3"
            class="ml-1"
            @click="if (page + 1 <= number_pages) page += 1;"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import * as e2w from "../assets/epics2web.js";
import card from "./card";

const EMPTY_PVS = {
  Temperature: {
    name: "",
    value: "?",
    hi_limit: 30,
    lo_limit: 10,
    subscribed: false,
  },
  Pressure: {
    name: "",
    value: "?",
    hi_limit: 1000,
    lo_limit: 800,
    subscribed: false,
  },
  "Rack Open": {
    name: "",
    value: "?",
    hi_limit: "",
    lo_limit: "",
    subscribed: false,
  },
  Humidity: {
    name: "",
    value: "?",
    hi_limit: 70,
    lo_limit: 30,
    subscribed: false,
  },
  Voltage: {
    name: "",
    value: "?",
    hi_limit: 90,
    lo_limit: 340,
    subscribed: false,
  },
  Current: {
    name: "",
    value: "?",
    hi_limit: 0,
    lo_limit: 20,
    subscribed: false,
  },
};

const SYMBOLS = {
  Temperature: " C",
  Humidity: "%",
  Pressure: " hPa",
  "Fan Speed": "RPM",
  Voltage: " V",
  Current: " A",
};

const SHORTHAND_TYPES = {
  t: "Temperature",
  h: "Humidity",
  p: "Pressure",
  v: "Voltage",
};

async function parse_json(self) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const response = await fetch("config.json");
      const data = await response.json();
      let pvs = [];
      self.symbols = data.symbols;
      for (const [parent, children] of Object.entries(data.items)) {
        let i = 0;
        for (const sensor of children) {
          const pv_names = Object.keys(sensor.pvs).map(
            (t) => sensor.pvs[t].name
          );

          self.items.push({
            parent: parent,
            name: sensor.name,
            pvs: fill_template(sensor.pvs),
            pv_names: pv_names,
            outlets: {
              number: i++,
              glitches: "?",
              currents: ["?", "?", "?", "?", "?", "?", "?", "?"],
              pf: "?",
            },
          });
          pvs = pvs.concat(pv_names);
        }
      }
      resolve(pvs);
    }, 100);
  });
}

function get_type(pv) {
  const pv_type = pv.split(":")[2];
  if (pv_type.includes("Temp")) return "Temperature";
  if (pv_type.includes("Pressure")) return "Pressure";
  if (pv_type.includes("Humidity")) return "Humidity";
  if (pv_type.includes("RackOpen")) return "Rack Open";
  if (pv_type.includes("Voltage")) return "Voltage";
  if (pv_type.includes("Current")) return "Current";
}

function fill_template(pvs) {
  let filled = JSON.parse(JSON.stringify(EMPTY_PVS)); // Deep copy needs to be made

  for (let type_key of Object.keys(pvs)) {
    filled[type_key].name = pvs[type_key].name;
  }

  return filled;
}

export default {
  components: {
    card,
  },
  props: ["settings"],
  data() {
    return {
      filter: {},
      page: 1,
      items_per_page: 8,
      headers: [],
      items: [],
      symbols: {},
      con: undefined,
    };
  },
  computed: {
    number_pages() {
      return Math.ceil(this.items.length / this.items_per_page);
    },
    filtered_keys() {
      return this.settings.keys.filter((key) => key !== "Name");
    },
    filter_valid() {
      return this.items.filter((i) => i.pvs.Pressure.value !== "0 hPa");
    },
  },
  methods: {
    num_sort(items, index) {
      items.sort((a, b) => {
        if (index[0] === "Name")
          return this.settings.sort_desc ? b.name > a.name : a.name > b.name;

        const is_first = a.pvs[index[0]].value > b.pvs[index[0]].value;
        return this.settings.sort_desc ? !is_first : is_first;
      });
      return items;
    },
    async get_all_subs() {
      const response = await fetch(
        "http://10.0.6.70:1337/simar/api/get_subscriptions",
        {
          headers: {
            Authorization: `Bearer ${await this.get_token()}`,
          },
        }
      );

      const subbed = await response.json();

      for (let i in this.items) {
        for (let pv of Object.keys(this.items[i].pvs)) {
          this.items[i].pvs[pv].subscribed = subbed.includes(
            this.items[i].pvs[pv].name
          );
        }
      }
      this.$forceUpdate();
    },
    async update_sub(item, key) {
      item.pvs[key].subscribed = !item.pvs[key].subscribed;
    },
    async open_pvs() {
      this.con.monitorPvs(await parse_json(this));
      await this.get_all_subs();
      const pv_prefixes = this.items.map((i) =>
        i.pvs.Temperature.name.substring(
          0,
          i.pvs.Temperature.name.lastIndexOf(":")
        )
      );
      let indexes = [];
      let sensors = await this.send_command("KEYS/SIMAR:*:Limits");
      let command = escape(
        `EVALSHA/82281378dbb9b4ab512a34823ed9722c0743394e/${sensors.KEYS.length}/`
      );
      for (let key of sensors.KEYS) {
        command += `${key}/`;
        indexes.push(
          pv_prefixes.indexOf(
            key.substring(key.indexOf(":") + 1, key.lastIndexOf(":"))
          )
        );
      }

      sensors = await this.send_command(command);

      for (let i = 0; i < sensors.EVALSHA.length; i++) {
        for (let j = 0; j < sensors.EVALSHA[i].length; j += 2) {
          const type_key = SHORTHAND_TYPES[sensors.EVALSHA[i][j].charAt(0)];
          const type_limit = sensors.EVALSHA[i][j].substring(2, 4) + "_limit";

          this.items[indexes[i]].pvs[type_key][type_limit] =
            sensors.EVALSHA[i][j + 1];
        }
      }
    },
    on_update(e) {
      const index = this.items.findIndex((i) =>
        i.pv_names.includes(e.detail.pv)
      );
      const pv_type = get_type(e.detail.pv);

      if (pv_type === "Rack Open") {
        // Rack door status
        this.items[index].pvs[pv_type].value =
          e.detail.value === 0 ? "No" : "Yes";
      } else if (pv_type === "Current") {
        this.items[index].outlets.currents[0] =
          e.detail.value.toFixed(2) + SYMBOLS[pv_type];
      } else {
        this.items[index].pvs[pv_type].value =
          e.detail.value.toFixed(2) + SYMBOLS[pv_type];
      }

      this.$forceUpdate();
    },
  },
  created() {
    var options = {
      url: "wss://" + this.$store.state.url + "/epics2web/monitor",
    };
    this.con = new e2w.jlab.epics2web.ClientConnection(options);

    this.con.onopen = this.open_pvs;
    this.con.onupdate = this.on_update;
  },
  async mounted() {
    let host = "10.0.38.46";
    if (window.location.host === "vpn.cnpem.br") {
      // If using WEB VPN
      // Capture IPv4 address
      const ipRegExp =
        /https?\/((?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])))\//;
      const match = ipRegExp.exec(window.location.href);
      if (match && match.length > 1) {
        host = match[1];
      }
    } else {
      host = window.location.host;
      if (
        host.includes("0.0.0.0") ||
        host.includes("localhost") ||
        host.includes("10.0.38.50") ||
        host.includes("10.0.6.70")
      ) {
        console.log("__`o##o>__ DEBUG SERVER. Setting host to 10.0.38.46");
      } else {
        this.$store.commit("setUrl", host);
      }
    }

    const serviceWorker = await navigator.serviceWorker.register("/sw.js");
    this.$store.commit("setSw", serviceWorker);
  },
};
</script>

<style scoped>
.no-margin {
  margin: 0;
}

.blue-background {
  background: rgb(21, 101, 192);
}

div:first-child .v-data-iterator {
  color: white;
}

.amb-val {
  color: white;
  padding: 0 16px;
}

.amb-val i {
  padding-right: 5px;
}
</style>
