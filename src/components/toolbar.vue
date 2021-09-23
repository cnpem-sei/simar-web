<template>
  <v-container fluid>
    <v-toolbar src="../assets/back.png" dark color="blue darken-3" class="mb-1">
      <template v-if="$vuetify.breakpoint.smAndDown">
        <v-btn icon v-on:click="dropdown = !dropdown">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
      <v-text-field
        v-on:input="$emit('search', $event)"
        clearable
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
      ></v-text-field>
      <template v-if="$vuetify.breakpoint.mdAndUp">
        <v-spacer />
        <v-select
          v-on:change="$emit('sort', $event)"
          flat
          solo-inverted
          hide-details
          v-model="sort_by"
          :items="this.settings.keys"
          prepend-inner-icon="mdi-sort"
          label="Sort by"
        ></v-select>
        <v-spacer />
        <v-btn-toggle v-on:change="$emit('desc', $event)" mandatory>
          <v-btn large depressed color="blue" :value="false" align="start">
            <v-icon>mdi-trending-up</v-icon>
          </v-btn>
          <v-btn large depressed color="blue" :value="true">
            <v-icon>mdi-trending-down</v-icon>
          </v-btn>
        </v-btn-toggle>
      </template>
      <v-spacer />
      <login style="flex-grow: 0" v-on="$listeners"></login>
    </v-toolbar>
    <v-toolbar
      v-if="dropdown && $vuetify.breakpoint.smAndDown"
      dark
      color="blue darken-3"
      class="mb-1"
    >
      <v-select
        v-on:change="$emit('sort', $event)"
        flat
        solo-inverted
        hide-details
        :items="this.settings.keys"
        prepend-inner-icon="mdi-magnify"
        label="Sort by"
      ></v-select>
      <v-spacer />
      <v-btn
        large
        depressed
        color="blue"
        v-show="!this.settings.sort_desc"
        v-on:click="$emit('desc', true)"
      >
        <v-icon>mdi-trending-down</v-icon>
      </v-btn>
      <v-btn
        large
        depressed
        color="blue"
        v-show="this.settings.sort_desc"
        align="start"
        v-on:click="$emit('desc', false)"
      >
        <v-icon>mdi-trending-up</v-icon>
      </v-btn>
    </v-toolbar>
  </v-container>
</template>

<script>
import login from "./login";

export default {
  components: { login },
  props: ["settings"],
  data() {
    return {
      filter: {},
      dropdown: false,
      logged: true,
      sort_by: this.settings.sort_by,
    };
  },
};
</script>
