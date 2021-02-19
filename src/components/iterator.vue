<template>
  <v-container fluid>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="this.settings.search"
      :sort-by="this.settings.sortBy"
      :sort-desc="this.settings.sortDesc"
      v-show="this.settings.viewMode"
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
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                  <v-list-item-content> {{ key }}: </v-list-item-content>
                  <v-chip
                    class="align-end"
                    :color="get_pv_color(item, key)"
                    text-color="white"
                  >
                    {{ item[key.toLowerCase()] }}
                  </v-chip>
                </v-list-item>
              </v-list>
            </v-card>
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
    <v-data-table
      :items="items"
      :headers="headers"
      :search="this.settings.search"
      class="elevation-1"
      v-show="!this.settings.viewMode"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="(col, columnIndex) in headers" :key="columnIndex">
            <div v-if="columnIndex > 0">
              <v-chip
                text-color="white"
                :color="get_pv_color(item, col.text)"
                >{{ item[col.value] }}</v-chip
              >
            </div>
            <div v-else-if="columnIndex == 0 || columnIndex == 1">
              <p>{{ item[col.value] }}</p>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
/*const getUrl = () => {
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

  if (host.includes("0.0.0.0") || host.includes("localhost")) {
    host = "10.0.38.42";
    console.log("DEBUG SERVER. Setting host to 10.0.38.42");
  }
  return host;
};*/

const parseJSON = async (self) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let pvs = [];

      fetch("config.json")
        .then((response) => response.json())
        .then((data) => {
          self.headers = data.headers;
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
  props: ["settings"],
  data() {
    return {
      filter: {},
      page: 1,
      itemsPerPage: 8,
      headers: [],
      items: [],
      config: [],
      symbols: {"temperature": " C", "pressure":" hPa", "voltage":" V"}
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
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    get_pv_color(value_raw, key) {
      if(value_raw[key.toLowerCase()] === "?")
      {
        return "gray";
      }

      const index = this.items.findIndex((i) => i.name === value_raw.name);
      const value = parseFloat(value_raw[key.toLowerCase()]);
      const m_type = key.toLowerCase().substring(0, 1);

      switch (key) {
        case "Temperature":
          if (value > this.config[index].t_hihi) return "red";
          else if (value > this.config[index].t_hi) return "orange";
          else return "green";
        case "Rack open":
          return value_raw["rack open"] === "No" ? "green" : "orange";
        default:
          if (
            value > this.config[index][m_type + "_hihi"] ||
            value < this.config[index][m_type + "_lolo"]
          )
            return "red";
          else if (
            value > this.config[index][m_type + "_hi"] ||
            value < this.config[index][m_type + "_lo"]
          )
            return "orange";
          else return "green";
      }
    },
  },
  created() {
    let self = this;
    //let url = getUrl();

    var ws = new WebSocket("ws://127.0.0.1:5678/");

    ws.onopen = async function () {
      let pvs = await parseJSON(self);

      /*for (let c of self.config) {
        for (const pv of c.pvs) {
          const type_index = pv.lastIndexOf(":") + 1;
          const m_type = pv.substring(type_index, type_index + 1);

          fetch("http://" + url + "/retrieval/bpl/getMetadata?pv=" + pv)
            .then((response) => response.json())
            .then((data) => {
              c[m_type + "_hihi"] = data.HIHI ?? c[m_type + "_hihi"];
              c[m_type + "_hi"] = data.HIGH ?? c[m_type + "_hi"];
              c[m_type + "_lolo"] = data.LOLO ?? c[m_type + "_lolo"];
              c[m_type + "_lo"] = data.LO ?? c[m_type + "_lo"];
            });
        }
      }*/

      ws.send(pvs);
    };

    ws.onmessage = function (e) {
      const pv = JSON.parse(e.data);
      const type = pv["name"].toLowerCase();
      const index = self.config.findIndex((i) => i.pvs.includes(type));

      switch (type) {
        case "pressure":
          self.items[index]["rack open"] =
            pv.value > self.config[index].hatch ? "No" : "Yes";
          break;
        default:
          break;
      }

      self.items[index][type] = pv.value.toFixed(2) + self.symbols[type];
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
</style>