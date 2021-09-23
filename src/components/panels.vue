<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header
        accordion
        class=""
        style="padding: 2px 16px; font-size: 16px"
        :disable-icon-rotate="critical"
      >
        Voltage
        <template v-slot:actions v-if="critical">
          <v-icon color="error"> mdi-alert-circle </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list dense style="column-count: 2">
          <v-list-item v-for="(key, index) in outlets.currents" :key="index">
            <v-list-item-icon style="margin-right: 3px"
              ><v-icon :color="get_color(index)"
                >mdi-power-plug-outline</v-icon
              ></v-list-item-icon
            >
            <v-list-item-content>{{ index }}</v-list-item-content>
            <v-spacer />
            <v-chip small :color="get_color(index)" text-color="white">
              {{
                `${outlets.voltage} ${outlets.voltage !== "?" ? "V" : ""} / ${
                  outlets.currents[index]
                } ${outlets.currents[index] !== "?" ? "A" : ""}`
              }}
            </v-chip>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-row style="padding: 0 16px; margin: 10px 0 0 0">
          <p style="margin: 0">Voltage Glitches Last Minute</p>
          <v-spacer />
          <v-chip small :color="get_glitch_color()" text-color="white">{{
            outlets.glitches
          }}</v-chip>
        </v-row>
        <v-row style="padding: 0 28px">
          <p>Power Factor</p>
          <v-spacer />
          <v-chip small :color="get_glitch_color()" text-color="white">{{
            outlets.pf
          }}</v-chip>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: ["outlets", "limits"],
  data: function () {
    return {
      critical: false,
    };
  },
  methods: {
    get_color(index) {
      // If at least one voltage/current value is critical, display a warning icon
      this.critical =
        (this.outlets.voltage !== "?" &&
          this.outlets.voltage > this.limits.hi) ||
        this.outlets.voltage < this.limits.lo ||
        this.outlets.currents.some((current) => {
          return current !== "?" && current > 20;
        }) ||
        this.outlets.glitches > 2;

      if (this.outlets.voltage === "?" || this.outlets.currents[index] === "?")
        return "gray";

      if (
        this.outlets.voltage > this.limits.hi ||
        this.outlets.voltage < this.limits.lo ||
        this.outlets.currents[index] > 20
      )
        return "red";

      return "green";
    },
    get_glitch_color() {
      if (this.outlets.glitches === "?") return "gray";
      if (this.outlets.glitches > 2) return "red";
      return "green";
    },
  },
};
</script>