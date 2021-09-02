<template>
  <v-container fluid>
    <v-data-iterator
      :items="filterValidItems"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="this.settings.search"
      :sort-by="this.settings.sortBy"
      :sort-desc="this.settings.sortDesc"
      :custom-sort="numSort"
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
            <iteratorcard
              :key="item.name"
              v-bind:item="item"
              v-bind:keys="settings.keys"
              v-bind:filteredKeys="filteredKeys"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-row class="mt-2 no-margin" align="center" justify="center">
          <span class="white--text">Items per page</span>
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
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in [8, 12, 16, 20]"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 white--text">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn dark color="blue darken-3" class="mr-1" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import * as e2w from "../assets/epics2web.js";
import iteratorcard from "./iteratorcard.vue";

const parseJSON = async (self) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      fetch("config.json")
        .then((response) => response.json())
        .then((data) => {
          const pvs = [];
          self.symbols = data.symbols;
          for (const [parent, children] of Object.entries(data.items)) {
            for (const sensor of children) {
              self.items.push(
                Object.assign(
                  {},
                  sensor.config,
                  {
                    parent: parent,
                    name: sensor.name,
                    outlets: {
                      voltage: "?",
                      currents: ["?", "?", "?", "?", "?", "?", "?", "?"],
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
    iteratorcard,
  },
  props: ["settings"],
  data() {
    return {
      filter: {},
      page: 1,
      itemsPerPage: 8,
      headers: [],
      items: [],
      symbols: {},
      edit_fan: false,
      con: undefined,
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.settings.keys.filter((key) => key !== "Name");
    },
    filterValidItems() {
      return this.items.filter((i) => i.values[1] !== "0 hPa");
    },
  },
  methods: {
    numSort(items, index) {
      items.sort((a, b) => {
        if (index[0] === "Name")
          return this.settings.sortDesc ? b.name > a.name : a.name > b.name;

        const pv_index = this.settings.keys.indexOf(index[0]);
        const end_char = pv_index === "Humidity-Mon" ? "%" : " ";
        let is_first = false;

        if (pv_index !== "RackOpen-Mon") {
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
          return this.settings.sortDesc ? !is_first : is_first;
        } else {
          is_first = a.values[pv_index] > b.values[pv_index];
        }
        return this.settings.sortDesc ? !is_first : is_first;
      });
      return items;
    },
    async openPVs() {
      this.con.monitorPvs(await parseJSON(this));
    },
    onUpdate(e) {
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
      } else if (pv_index === 5) {
        // Voltage value, since voltage is fifth
        this.items[index].outlets.voltage = e.detail.value.toFixed(2);
      } else if (pv_index > 5) {
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
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
  },
  created() {
    var options = {
      url: "ws://" + this.$store.state.url + "/epics2web/monitor",
    };
    this.con = new e2w.jlab.epics2web.ClientConnection(options);

    this.con.onopen = this.openPVs;
    this.con.onupdate = this.onUpdate;
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
</style>
