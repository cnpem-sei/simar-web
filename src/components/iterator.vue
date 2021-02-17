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
                <v-list-item
                  v-for="(key, index) in filteredKeys"
                  :key="index"
                >
                  <v-list-item-content>
                    {{ key }}:
                  </v-list-item-content>
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
    </v-data-iterator>
    <v-data-table
        :items="items"
        :headers="headers"
        :search="this.settings.search"
        class="elevation-1"
        v-show="!this.settings.viewMode"
      >
      <template v-slot:item="{item}">
            <tr>
              <td 
              v-for="(col, columnIndex) in headers"
              :key="columnIndex">
                <div v-if="columnIndex > 0">
                  <v-chip text-color="white" :color="get_pv_color(item, col.text)">{{ item[col.value] }}</v-chip>
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
  import * as e2w from "../assets/epics2web.js"

  const getUrl = ()=> {
	let host = "10.0.38.42";
	if (window.location.host === "vpn.cnpem.br") { // If using WEB VPN
			// Capture IPv4 address
			const ipRegExp = /https?\/((?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])))\//;
			const match = ipRegExp.exec(window.location.href);
			if (match && match.length > 1) {
					host = match[1];
			}
	} else {
			host = window.location.host;
	}

	if (host === "0.0.0.0:8000" || host === "0.0.0.0:8080") {
			host = "10.0.38.42";
			console.log("DEBUG SERVER. Setting host to 10.0.38.42");
	}
	return host;
  };

  var options = {url : "ws://" + getUrl() + "/epics2web/monitor"};
  var con = new e2w.jlab.epics2web.ClientConnection(options);

  export default {
    props: ["settings"],
    data () {
      return {
        filter: {},
        page: 1,
        itemsPerPage: 8,
        headers: [
          {text:'Name', value:'name'},
          {text:'Value', value:'value'},
          {text:'Connected', value:'connected'}
        ],
        items: [
          {
            name: 'RAD:Thermo12:TotalDoseRate:Dose',
            value: '300 uSv',
            connected: 'Yes'
          },
          {
            name: 'RAD:Thermo11:TotalDoseRate:Dose',
            value: '300 uSv',
            connected: 'Yes'
          },
          {
            name: 'RAD:Thermo10:TotalDoseRate:Dose',
            value: '300 uSv',
            connected: 'Yes'
          },
          {
            name: 'RAD:Thermo9:TotalDoseRate:Dose',
            value: '300 uSv',
            connected: 'Yes'
          },
          {
            name: 'RAD:Thermo8:TotalDoseRate:Dose',
            value: '300 uSv',
            connected: 'Yes'
          },
          {
            name: 'RAD:Thermo7:TotalDoseRate:Dose',
            value: '300 uSv',
            connected: 'Yes'
          },
          {
            name: 'RAD:Thermo6:TotalDoseRate:Dose',
            value: '300 uSv',
            connected: 'Yes'
          },
          {
            name: 'RAD:Thermo5:TotalDoseRate:Dose',
            value: '300 uSv',
            connected: 'Yes'
          },
          {
            name: 'RAD:Thermo4:TotalDoseRate:Dose',
            value: '300 uSv',
            connected: 'Yes'
          },
          {
            name: 'RAD:Thermo3:TotalDoseRate:Dose',
            value: '300 uSv',
            connected: 'Yes'
          },
          {
            name: 'RAD:Thermo2:TotalDoseRate:Dose',
            value: '300 uSv',
            connected: 'Yes'
          },
        ],
      }
    },
    computed: {
      numberOfPages () {
        return Math.ceil(this.items.length / this.itemsPerPage)
      },
      filteredKeys () {
        return this.settings.keys.filter(key => key !== 'Name')
      }
    },
    methods: {
      nextPage () {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage () {
        if (this.page - 1 >= 1) this.page -= 1
      },
      updateItemsPerPage (number) {
        this.itemsPerPage = number
      },
      get_pv_color(value_raw, key) {
        let connected = value_raw.connected == "Yes"; 

        if(key === "Connected"){
          return connected ? "green" : "red";
        } else {
          let value = parseFloat(value_raw.value);
          if (!connected) return 'grey'
          else if (value > 1) return 'red'
          else if (value > 0.6) return 'orange'
          else return 'green'
        }
      }
    },
    created() {
      let self = this;
      console.log(self.items);

      con.onopen = function () {
        con.monitorPvs(self.items.map(i => i.name));
      }

      con.onupdate = function (e) {
        const index = self.items.map(i => i.name).indexOf(e.detail.pv);
        self.items[index].value = e.detail.value.toFixed(2) + " uSv";
      }
    }
  }
</script>