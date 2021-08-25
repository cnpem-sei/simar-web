<template>
  <v-range-slider
    v-model="range"
    :max="max"
    :min="0"
    :label="name"
    hide-details
    class="align-center"
    style="width: 90%; margin: auto"
  >
    <template v-slot:append>
      <v-text-field
        :value="range[0]"
        class="mt-0 pt-0"
        hide-details
        single-line
        type="number"
        style="width: 60px"
        @change="$set(item, lo, $event)"
      ></v-text-field>
      <v-text-field
        :value="range[1]"
        class="mt-0 pt-0"
        hide-details
        single-line
        type="number"
        style="width: 60px; margin-left: 10px"
        @change="$set(item, hi, $event)"
      ></v-text-field>
    </template>
  </v-range-slider>
</template>

<script>
export default {
  props: ["item", "name"],
  data: function () {
    return {
      lo: "",
      hi: "",
      min: -100,
      max: 80
    };
  },
  computed: {
    range: {
      get() {
        return [this.item[this.lo], this.item[this.hi]];
      },
      set(input) {
        this.item[this.lo] = input[0];
        this.item[this.hi] = input[1];
      },
    },
  },
  mounted() {
    const type = this.name.charAt(0).toLowerCase();

    console.log(type);

    this.lo = `${type}_lo`;
    this.hi = `${type}_hi`;

    console.log(this.lo);

    switch(type) {
        case "v":
            this.max = 1000;
            break;
        case "h":
            this.max = 100;
            break;
    }
  },
};
</script>