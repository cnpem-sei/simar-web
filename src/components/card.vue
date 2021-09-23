<template>
  <v-card>
    <v-card-title class="subheading font-weight-bold">
      {{ item.name }}
      <v-spacer/>
      <config v-bind:item="item" />
    </v-card-title>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item v-for="(key, index) in filtered_keys" :key="index">
        <v-list-item-content> {{ key }}: </v-list-item-content>
        <v-chip
          class="align-end"
          :color="get_pv_color(item, key)"
          text-color="white"
          :href="`https://${$store.state.url}/archiver-viewer/?pv=${item.pvs[index]}`"
        >
          {{ item.values[index] }}
        </v-chip>
      </v-list-item>
    </v-list>
    <panels
      v-bind:outlets="item.outlets"
      v-bind:limits="{ lo: item.v_lo, hi: item.v_hi }"
    />
  </v-card>
</template>

<script>
import panels from "./panels";
import config from "./config";

export default {
  props: ["items", "item", "filtered_keys", "keys"],
  data: function () {
    return {
      dialog: false,
    };
  },
  components: {
    panels,
    config,
  },
  methods: {
    get_pv_color(value_raw, key) {
      const value = value_raw.values[this.keys.indexOf(key) - 1];

      if (value === "?") return "gray";

      const m_type = key.charAt(0).toLowerCase();
      const f_value =
        m_type !== "h"
          ? parseFloat(value.substring(0, value.indexOf(" ")))
          : parseFloat(value.substring(0, value.indexOf("%")));

      switch (key) {
        case "Rack open":
          return value_raw.values[this.keys.indexOf("Rack open") - 1] === "No"
            ? "green"
            : "orange";
        default:
          if (
            f_value > value_raw[m_type + "_hi"] * 1.2 ||
            f_value < value_raw[m_type + "_lo"] * 0.8
          )
            return "red";
          else if (
            f_value > value_raw[m_type + "_hi"] ||
            f_value < value_raw[m_type + "_lo"]
          )
            return "orange";
          else return "green";
      }
    },
  },
};
</script>
