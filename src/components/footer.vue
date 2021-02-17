<template>
<v-footer
      color="primary darken-2"
      padless
    >
      <v-row
        justify="center"
        no-gutters
      >
        <v-btn
          v-for='link in ["Wiki", "Gitlab", "Contact"]'
          :key="link"
          color="white"
          text
          rounded
          class="my-2"
        >
          {{ link }}
        </v-btn>
        <v-col
          class="primary darken-3 py-4 text-center white--text"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>CNPEM</strong>
        </v-col>
      </v-row>
    </v-footer>
</template>