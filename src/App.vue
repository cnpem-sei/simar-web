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
  </v-app>
</template>

<script>
import iterator from "./components/iterator";
import toolbar from "./components/toolbar";

export default {
  name: "App",

  components: {
    toolbar,
    iterator,
  },

  data: () => ({
    settings: {
      sortDesc: false,
      viewMode: true,
      sortBy: "name",
      search: "",
      keys: ["Name", "Value", "Connected"],
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