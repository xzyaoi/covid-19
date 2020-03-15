<template>
  <v-row>
    <v-col class="d-flex" cols="12" sm="4">
      <v-select eager :items="display_countries" label="Country/Region" v-model="country"></v-select>
    </v-col>
    <v-col class="d-flex" cols="12" sm="4">
      <v-select :items="display_states" label="State/Province" v-model="state"></v-select>
    </v-col>
    <v-col class="d-flex" cols="12" sm="2">
      <v-select :items="datatypes" label="Type" v-model="datatype"></v-select>
    </v-col>
    <v-col class="d-flex" cols="12" sm="2">
      <v-btn outlined @click="trigger_draw()">OK</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      country: "",
      state: "",
      datatype: "",
      datatypes: ["Confirmed", "Deaths", "Recovered"]
    };
  },
  props: ["countries", "states"],
  computed: {
    display_countries() {
      return this.countries.slice().sort();
    },
    display_states() {
      return this.states.slice().sort();
    }
  },
  watch: {
    country(newVal) {
      console.log(newVal);
      this.$emit("selectedCountry", newVal);
    },
  },
  methods: {
    trigger_draw() {
      this.$emit("triggerDraw", {
        country: this.country,
        state: this.state,
        datatype: this.datatype
      });
    }
  }
};
</script>

<style scoped>
</style>