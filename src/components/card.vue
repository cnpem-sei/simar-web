<template>
  <v-card>
    <v-card-title class="subheading font-weight-bold">
      {{ item.name }}
      <v-spacer />
      <config v-bind:item="item" />
    </v-card-title>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item v-for="(key, index) in filtered_keys" :key="index">
        <v-list-item-content> {{ key }}: </v-list-item-content>

        <v-hover v-slot:default="{ hover }">
          <span>
            <v-slide-x-reverse-transition>
              <notify
                v-show="
                  (hover || item.pvs[key].subscribed) &&
                  item.pvs[key].value !== '?'
                "
                v-bind:pv="item.pvs[key]"
                @update-sub="$emit('update-sub', key)"
              />
            </v-slide-x-reverse-transition>
            <v-chip
              class="align-end"
              :color="get_pv_color(item, key)"
              text-color="white"
              :href="`https://${$store.state.url}/archiver-viewer/?pv=${item.pvs[key].name}`"
            >
              {{ item.pvs[key].value }}
            </v-chip>
          </span>
        </v-hover>
      </v-list-item>
    </v-list>
    <panels
      v-bind:item="item"
      v-bind:limits="{ lo: item.v_lo, hi: item.v_hi }"
    />
  </v-card>
</template>

<script>
import panels from "./panels";
import config from "./config";
import notify from "./notify";

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
    notify,
  },
  methods: {
    get_pv_color(item, key) {
      const value = item.pvs[key].value;

      if (value === "?") return "gray";

      const m_type = key.charAt(0).toLowerCase();
      const f_value =
        m_type !== "h"
          ? parseFloat(value.substring(0, value.indexOf(" ")))
          : parseFloat(value.substring(0, value.indexOf("%")));

      switch (key) {
        case "Rack Open":
          return value === "No" ? "green" : "orange";
        default:
          if (
            f_value > item.pvs[key].hi_limit * 1.2 ||
            f_value < item.pvs[key].lo_limit * 0.8
          )
            return "red";
          else if (
            f_value > item.pvs[key].hi_limit ||
            f_value < item.pvs[key].lo_limit
          )
            return "orange";
          else return "green";
      }
    },
  },
};
</script>
