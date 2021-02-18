<template>
  <v-app>
    <v-main fluid>
      <toolbar
        @sort="updateSort"
        @desc="updateDesc"
        @view="updateView"
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
      viewMode: true,
      sortBy: "name",
      search: "",
      keys: ["Name", "Temperature", "Pressure", "Voltage", "Hatch open", "Fan speed"],
    },
  }),

  methods: {
    updateSearch: function (value) {
      this.settings.search = value;
    },
    updateView: function (value) {
      this.settings.viewMode = value;
    },
    updateDesc: function (value) {
      this.settings.sortBy = value.toLowerCase();
    },
    updateSort: function (value) {
      this.settings.sortDesc = value;
    },
  },
};
</script>

<style scoped>
.v-main {
  background: rgb(1, 45, 87); 
}
</style>