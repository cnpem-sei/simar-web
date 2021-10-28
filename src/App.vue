<template>
  <v-app>
    <v-main fluid>
      <toolbar
        @sort="update_sort"
        @desc="update_desc"
        @search="update_search"
        v-bind:settings="settings"
      />
      <iterator v-bind:settings="settings" />
    </v-main>
    <ft />

    <v-snackbar
      v-model="$store.state.snackbar"
      timeout="4000"
      color="white"
      light
    >
      {{ $store.state.message }}

      <template v-slot:action="{ attrs }">
        <v-btn icon text v-bind="attrs" @click="$store.commit('hideSnackbar')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import iterator from "./components/iterator";
import toolbar from "./components/toolbar";
import ft from "./components/footer";

export default {
  name: "SIMAR",
  components: {
    toolbar,
    iterator,
    ft,
  },
  data: () => ({
    settings: {
      sort_desc: false,
      sort_by: "Name",
      search: "",
      keys: [
        "Name",
        "Temperature",
        "Pressure",
        "Rack Open",
        "Humidity",
      ],
      pvs: {},
    },
  }),

  methods: {
    update_search: function (value) {
      this.settings.search = value;
    },
    update_desc: function (value) {
      this.settings.sort_desc = value;
    },
    update_sort: function (value) {
      this.settings.sort_by = value;
    },
  },
};
</script>

<style scoped>
.v-main {
  background: rgb(1, 45, 87);
}
</style>