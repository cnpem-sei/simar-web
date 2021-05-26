<template>
  <v-card>
    <v-card-title class="subheading font-weight-bold">
      {{ item.name }}
    </v-card-title>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item v-for="(key, index) in filteredKeys" :key="index">
        <v-list-item-content> {{ key }}: </v-list-item-content>
        <v-btn
          v-if="key === 'Fan speed'"
          text
          rounded
          @click="edit_fan = !edit_fan"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-text-field
          v-if="key == 'Fan speed' && edit_fan"
          suffix="RPM"
          label="Speed"
          type="number"
          outlined
          dense
          hide-details="true"
        ></v-text-field>
        <v-chip
          v-if="key != 'Fan speed' || !edit_fan"
          class="align-end"
          :color="get_pv_color(item, key)"
          text-color="white"
        >
          {{ item[pvs[key]] }}
        </v-chip>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: ["items", "item", "filteredKeys", "pvs"],
  data: function () {
    return {
      edit_fan: false,
    };
  },
  methods: {
    get_pv_color(value_raw, key) {
      const m_type =
        key.substring(0, 1).toLowerCase() !== "c"
          ? key.substring(0, 1).toLowerCase()
          : key.substring(5, 6).toLowerCase();

      key = this.pvs[key];
      if (value_raw[key] === "?") return "gray";

      const index = this.items.findIndex((i) => i.name === value_raw.name);
      const value = parseFloat(value_raw[key]);

      switch (key) {
        case "Rack open":
          return value_raw["RackOpen-Mon"] === "No" ? "green" : "orange";
        default:
          if (
            value > this.items[index][m_type + "_hihi"] ||
            value < this.items[index][m_type + "_lolo"]
          )
            return "red";
          else if (
            value > this.items[index][m_type + "_hi"] ||
            value < this.items[index][m_type + "_lo"]
          )
            return "orange";
          else return "green";
      }
    },
  },
};
</script>

<style>
.v-text-field {
  width: 30%;
  display: inline-block;
}
</style>