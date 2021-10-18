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
              :href="`https://${$store.state.url}/archiver-viewer/?pv=${
                items.at(-1).pvs[0]
              }`"
              ><v-icon dark>mdi-thermometer</v-icon
              >{{ items.at(-1).values[0] }}</v-btn
            >
            <v-btn
              plain
              class="amb-val"
              :href="`https://${$store.state.url}/archiver-viewer/?pv=${
                items.at(-1).pvs[1]
              }`"
              ><v-icon dark>mdi-gauge</v-icon
              >{{ items.at(-1).values[1] }}</v-btn
            >
            <v-btn
              plain
              class="amb-val"
              :href="`https://${$store.state.url}/archiver-viewer/?pv=${
                items.at(-1).pvs[4]
              }`"
              ><v-icon dark>mdi-water-percent</v-icon
              >{{ items.at(-1).values[4] }}</v-btn
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

const parse_json = async (self) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      fetch("config.json")
        .then((response) => response.json())
        .then((data) => {
          const pvs = [];
          self.symbols = data.symbols;
          for (const [parent, children] of Object.entries(data.items)) {
            let i = 0;
            for (const sensor of children) {
              self.items.push(
                Object.assign(
                  {},
                  sensor.config,
                  {
                    parent: parent,
                    name: sensor.name,
                    outlets: {
                      number: i++,
                      glitches: "?",
                      voltage: "?",
                      currents: ["?", "?", "?", "?", "?", "?", "?", "?"],
                      pf: "?",
                    },
                  },
                  { values: ["?", "?", "?", "?", "?", "?"] }
                )
              );
              for (let inner_pv of sensor.config.pvs) {
                if (inner_pv !== "") {
                  pvs.push(inner_pv);
                }
              }
            }
          }
          resolve(pvs);
        });
    }, 100);
  });
};

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
      return this.items.filter((i) => i.values[1] !== "0 hPa");
    },
  },
  methods: {
    num_sort(items, index) {
      items.sort((a, b) => {
        if (index[0] === "Name")
          return this.settings.sort_desc ? b.name > a.name : a.name > b.name;

        const pv_index = this.settings.keys.indexOf(index[0]) - 1;
        const end_char = pv_index === 5 ? "%" : " ";
        let is_first = false;

        if (pv_index !== 2) {
          is_first =
            parseFloat(
              a.values[pv_index].substring(
                0,
                a.values[pv_index].indexOf(end_char)
              )
            ) >
            parseFloat(
              b.values[pv_index].substring(
                0,
                b.values[pv_index].indexOf(end_char)
              )
            );
          return this.settings.sort_desc ? !is_first : is_first;
        } else {
          is_first = a.values[pv_index] > b.values[pv_index];
        }
        return this.settings.sort_desc ? !is_first : is_first;
      });
      return items;
    },
    async open_pvs() {
      this.con.monitorPvs(await parse_json(this));
      const pv_prefixes = this.items.map((i) =>
        i.pvs[0].substring(0, i.pvs[0].lastIndexOf(":"))
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
        for (let j = 0; j < sensors.EVALSHA[i].length; j += 2)
          this.items[indexes[i]][sensors.EVALSHA[i][j]] =
            sensors.EVALSHA[i][j + 1];
      }
    },
    on_update(e) {
      const pv = e.detail.pv;
      const index = this.items.findIndex((i) => i.pvs.includes(pv));
      const pv_index = this.items[index].pvs.indexOf(e.detail.pv);

      if (pv.includes("RackOpen-Mon")) {
        // Rack door status
        this.$set(
          this.items[index].values,
          pv_index,
          e.detail.value == 0 ? "No" : "Yes"
        );
      } else if (pv_index === 5 || pv_index === 6) {
        // Voltage value, since voltage is fifth
        this.items[index].outlets[pv_index === 5 ? "voltage" : "glitches"] =
          e.detail.value.toFixed(2);
      } else if (pv_index > 6) {
        // One of 8 possible current values, current values are available from the sixth PV onwards
        this.items[index].outlets.currents[pv_index - 6] =
          e.detail.value.toFixed(2);
      } else {
        // Other PVs
        this.$set(
          this.items[index].values,
          pv_index,
          e.detail.value.toFixed(2) + this.symbols[pv_index]
        );
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
  mounted() {
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
