<template>
  <v-app>
    <v-main fluid>
      <toolbar
        @sort="updateSort"
        @desc="updateDesc"
        @search="updateSearch"
        v-bind:settings="settings"
      />
      <iterator v-bind:settings="settings" />
    </v-main>
    <ft/>
  </v-app>
</template>

<script>
import iterator from "./components/iterator";
import toolbar from "./components/toolbar";
import ft from "./components/footer";

export default {
  name: "App",

  components: {
    toolbar,
    iterator,
    ft
  },

  data: () => ({
    settings: {
      sortDesc: false,
      sortBy: "name",
      search: "",
      keys: ["Name", "Temperature", "Pressure", "Voltage", "Rack open", "Fan speed", "Humidity"],
    },
  }),

  methods: {
    updateSearch: function (value) {
      this.settings.search = value;
    },
    updateDesc: function (value) {
      this.settings.sortDesc = value;
    },
    updateSort: function (value) {
      this.settings.sortBy = value.toLowerCase();
    },
  },
};
</script>

<style scoped>
.v-main {
  background: rgb(1, 45, 87); 
}
</style>