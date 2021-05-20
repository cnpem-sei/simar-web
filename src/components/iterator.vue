<template>
  <v-container fluid>
    <v-data-iterator
      :items="items"
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
              v-bind:items="props.items"
              v-bind:config="config"
              v-bind:item="item"
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
import iteratorcard from "./iteratorcard.vue"

const getUrl = () => {
  let host = "10.0.38.42";
  if (window.location.host === "vpn.cnpem.br") {
    // If using WEB VPN
    // Capture IPv4 address
    const ipRegExp = /https?\/((?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])))\//;
    const match = ipRegExp.exec(window.location.href);
    if (match && match.length > 1) {
      host = match[1];
    }
  } else {
    host = window.location.host;
  }

  if (host.includes("0.0.0.0") || host.includes("localhost") || host.includes("10.0.38.50")) {
    host = "10.0.38.42";
    console.log("__`o##o>__ DEBUG SERVER. Setting host to 10.0.38.42");
  }
  return host;
};

const parseJSON = async (self) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let pvs = [];

      fetch("config.json")
        .then((response) => response.json())
        .then((data) => {
          self.headers = data.headers;
          self.symbols = data.symbols;
          for (const item of data.items) {
            self.config.push(item.config);
            self.items.push(item.fields);
            pvs = pvs.concat(item.config.pvs);
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
      config: [],
      symbols: {},
      edit_fan: false,
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.settings.keys.filter((key) => key !== "Name");
    },
  },
  methods: {
    numSort(items, index) {
      items.sort((a, b) => {
        let index_name = index[0];
        let c = index_name === "humidity" ? "%" : " ";

        if (index_name !== "rack open" && index_name !== "name") {
          if (!this.settings.sortDesc)
            return parseFloat(a[index].substring(0,a[index].indexOf(c))) > parseFloat(b[index].substring(0,b[index].indexOf(c)));
          else
            return parseFloat(b[index].substring(0,b[index].indexOf(c))) > parseFloat(a[index].substring(0,a[index].indexOf(c)));
        } else {
          if (!this.settings.sortDesc)
            return a[index] > b[index];
          else
            return b[index] > a[index];
        }
      });
      return items;
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
    let self = this;
    let url = getUrl();

    var options = { url: "ws://" + url + "/epics2web/monitor" };
    var con = new e2w.jlab.epics2web.ClientConnection(options);

    con.onopen = async function () {
      let pvs = await parseJSON(self);

      for (let c of self.config) {
        for (const pv of c.pvs) {
          const type_index = pv.lastIndexOf(":") + 1;
          const m_type = pv.substring(type_index, type_index + 1);

          fetch("http://" + url + "/retrieval/bpl/getMetadata?pv=" + pv)
            .then((data) => {
              if(data !== undefined){
                c[m_type + "_hihi"] = data.HIHI ?? c[m_type + "_hihi"];
                c[m_type + "_hi"] = data.HIGH ?? c[m_type + "_hi"];
                c[m_type + "_lolo"] = data.LOLO ?? c[m_type + "_lolo"];
                c[m_type + "_lo"] = data.LO ?? c[m_type + "_lo"];
              }
            });
        }
      }

      con.monitorPvs(pvs);
    };

    con.onupdate = function (e) {
      const pv = e.detail.pv;
      const pv_type = pv.substring(pv.lastIndexOf(":") + 1).toLowerCase();
      const index = self.config.findIndex((i) => i.pvs.includes(pv));

      if(index === 2)
        console.log(pv_type)

      if(pv_type == "open") {
        self.items[index]["rack open"] = e.detail.value == 0 ? "No" : "Yes";
      } else if (pv_type.substring(0,3) === "ext") {
        self.items[index]["ext. " + pv_type.substring(3)] = e.detail.value.toFixed(2) + self.symbols[pv_type];
      } else {
        self.items[index][pv_type] = e.detail.value.toFixed(2) + self.symbols[pv_type];
      }
    };
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