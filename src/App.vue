<template>
  <v-app>
    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>COVID-19 Stats and Prediction</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <v-row v-for="index in display_length" :key="index">
        <select-field
          v-if="loaded"
          class="selection"
          :countries="countries"
          :states="states"
          @selectedCountry="fetchStates"
          @triggerDraw="drawData"
        ></select-field>
      </v-row>
        <v-btn @click="newSource" color="primary">
          Add New Source
        </v-btn>
        <v-card style="margin-top:20px">
        <div id="main_plot"></div>
        </v-card>
    </v-content>
    <v-footer dark padless>
      <v-card class="flex" flat tile>
        <v-card-title class="teal">
          <strong class="subheading">
            <a style="color: white;">United we stand, divided we fall.</a>
          </strong>
          <v-spacer></v-spacer>
        </v-card-title>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import { parse_data } from "./services/dataloader";
import SelectField from "./components/SelectField";
import Plotly from "plotly.js-dist";

export default {
  name: "App",
  data() {
    return {
      confirmed_dataset: [],
      recovered_dataset: [],
      deaths_dataset: [],
      countries: [],
      states: [],
      loaded: false,
      layout: {
        autosize: true,
        width: 1500,
        height: 500,
        margin: {
          l: 50,
          r: 50,
          b: 100,
          t: 100,
          pad: 4
        },
        paper_bgcolor: "white",
        plot_bgcolor: "white"
      },
      main_plot: null,
      drawDatasource:[],
      display_length: 1
    };
  },
  components: {
    "select-field": SelectField
  },
  methods: {
    newSource() {
      this.display_length+=1
    },
    prepareDataset(datatype, withRegion) {
      return parse_data(datatype, withRegion);
    },
    fetchStates(country) {
      this.states = this.confirmed_dataset["data"]
        .filter(row => row[1] == country)
        .map(function(row) {
          return row[0];
        });
    },
    initialize_plot() {
      this.main_plot = document.getElementById("main_plot");
    },
    drawData(setting) {
      console.log(setting)
      const data = this.queryData(
        setting["country"],
        setting["state"],
        setting["datatype"]
      );
      this.drawDatasource.push({
            x: this.confirmed_dataset["dayHeader"],
            y: data.slice(4),
            name: setting["country"] + "/" + setting["state"] + "(" + setting["datatype"]+")"
          }
      );
      Plotly.newPlot(
        this.main_plot,
        this.drawDatasource,
        this.layout
      );
    },
    queryData(country, state, source) {
      let datasource = this.getDatasource(source);
      console.log(datasource);
      return datasource["data"].filter(function(each) {
        if (each[1] === country && each[0] === state) {
          return true;
        }
      })[0];
    },
    getDatasource(source) {
      let datasource;
      if (source === "Confirmed") {
        datasource = this.confirmed_dataset;
      } else if (source === "Deaths") {
        datasource = this.deaths_dataset;
      } else {
        datasource = this.recovered_dataset;
      }
      return datasource;
    },
    fetchCountryTotal() {}
  },
  mounted() {
    let self = this;
    this.prepareDataset("CONFIRMED", true).then(function(res) {
      self.countries = [...res["countries"]];
      self.confirmed_dataset = res["result"];
      self.loaded = true;
    });
    this.initialize_plot()
    // this.prepareDataset("RECOVERED")
    // this.prepareDataset("DEATHS")
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.selection {
  margin-left: 10%;
  margin-right: 10%;
}
</style>
