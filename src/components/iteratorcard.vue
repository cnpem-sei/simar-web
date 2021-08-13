<template>
  <v-card>
    <v-card-title class="subheading font-weight-bold">
      {{ item.name }}
      <v-spacer></v-spacer>
      <config v-bind:name="item.name" v-bind:outlets="item.outlets" v-on="$listeners" />
    </v-card-title>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item v-for="(key, index) in filteredKeys" :key="index">
        <v-list-item-content> {{ key }}: </v-list-item-content>
        <v-chip
          v-if="key != 'Fan speed' || !edit_fan"
          class="align-end"
          :color="get_pv_color(item, key)"
          text-color="white"
          :href="`http://10.0.38.42/archiver-viewer/?pv=${item.pvs[index]}`"
        >
          {{ item.values[index] }}
        </v-chip>
      </v-list-item>
    </v-list>
    <panels v-bind:outlets="item.outlets" />
  </v-card>
</template>

<script>
import panels from "./panels.vue";
import config from "./config.vue";

export default {
  props: ["items", "item", "filteredKeys", "keys"],
  data: function () {
    return {
      edit_fan: false,
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
      const f_value = parseFloat(value.substring(0, value.indexOf(" ")));

      switch (key) {
        case "Rack open":
          return value_raw.values[this.keys.indexOf("Rack open") - 1] === "No"
            ? "green"
            : "orange";
        default:
          if (
            f_value > value_raw[m_type + "_hihi"] ||
            f_value < value_raw[m_type + "_lolo"]
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

<style>
</style>