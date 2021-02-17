<template>
  <v-container fluid>
    <v-toolbar src="../assets/back.png" dark color="blue darken-3" class="mb-1">
      <v-text-field
        v-on:input='$emit("search", $event)'
        clearable
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
      ></v-text-field>
      <template v-if="$vuetify.breakpoint.mdAndUp">
        <v-spacer></v-spacer>
        <v-select
          v-on:change='$emit("desc", $event)'
          flat
          solo-inverted
          hide-details
          :items="keys"
          prepend-inner-icon="mdi-magnify"
          label="Sort by"
          v-show="this.settings.viewMode"
        ></v-select>
        <v-spacer></v-spacer>
        <v-btn-toggle
          v-on:change='$emit("sort", $event)'
          mandatory
          v-show="this.settings.viewMode"
        >
          <v-btn large depressed color="blue" :value="false" align="start">
            <v-icon>mdi-trending-up</v-icon>
          </v-btn>
          <v-btn large depressed color="blue" :value="true">
            <v-icon>mdi-trending-down</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-spacer></v-spacer>
        <v-btn-toggle v-on:change='$emit("view", $event)' mandatory>
          <v-btn large depressed color="blue" :value="false">
            <v-icon>mdi-table</v-icon>
          </v-btn>
          <v-btn large depressed color="blue" :value="true">
            <v-icon>mdi-view-module</v-icon>
          </v-btn>
        </v-btn-toggle>
      </template>
      <template v-if="$vuetify.breakpoint.smAndDown">
      <v-btn icon v-on:click="dropdown = !dropdown">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        </template>
    </v-toolbar>
    <v-toolbar v-if="dropdown && $vuetify.breakpoint.smAndDown" dark color="blue darken-3" class="mb-1">
        <v-select
          v-on:change='$emit("desc", $event)'
          flat
          solo-inverted
          hide-details
          :items="keys"
          prepend-inner-icon="mdi-magnify"
          label="Sort by"
          v-show="this.settings.viewMode"
        ></v-select>
        <v-btn v-show="this.settings.viewMode" icon v-on:click='$emit("view", false)'>
          <v-icon>mdi-table</v-icon>
        </v-btn>
        <v-btn v-show="!this.settings.viewMode" icon v-on:click='$emit("view", true)'>
          <v-icon>mdi-view-module</v-icon>
        </v-btn>
        <v-btn-toggle
          v-on:change='$emit("sort", $event)'
          mandatory
          v-show="this.settings.viewMode"
        >
          <v-btn large depressed color="blue" :value="false" align="start">
            <v-icon>mdi-trending-up</v-icon>
          </v-btn>
          <v-btn large depressed color="blue" :value="true">
            <v-icon>mdi-trending-down</v-icon>
          </v-btn>
        </v-btn-toggle>
    </v-toolbar>
  </v-container>
</template>

<script>
export default {
  props: ["settings"],
  data() {
    return {
      filter: {},
      dropdown: false,
      keys: ["Name", "Value", "Connected"],
    };
  },
};
</script>