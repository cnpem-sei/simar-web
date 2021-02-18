<template>
  <v-footer color="primary darken-2" padless>
    <v-row justify="center" no-gutters>
      <v-btn
        href="https://wiki-sirius.lnls.br/mediawiki/index.php/CON:CON"
        color="white"
        text
        rounded
        class="my-2"
      >
        wiki
      </v-btn>
      <v-btn
        href="https://gitlab.cnpem.br/IoT/simar-vue"
        color="white"
        text
        rounded
        class="my-2"
      >
        gitlab
      </v-btn>
      <v-btn
        href="mailto:guilherme.freitas@cnpem.br"
        color="white"
        text
        rounded
        class="my-2"
      >
        contact
      </v-btn>
      <v-col class="primary darken-3 py-4 text-center white--text" cols="12">
        {{ new Date().getFullYear() }} — <strong>CNPEM</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>