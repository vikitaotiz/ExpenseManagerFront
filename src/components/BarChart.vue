<template>
  <Bar :chart-options="chartOptions" :chart-data="chartData" />
</template>

<script>
import { Bar } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { fetchData, getRandomColor } from "src/utilities/commonMethods";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: "BarChart",
  components: {
    Bar,
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Last 7 days sales",
            backgroundColor: "#029E43",
            data: [],
          },

          {
            label: "Last 7 days purchases",
            backgroundColor: "#000",
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },

  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      const res = await fetchData("entries_last_seven_days");
      let arr1 = [];
      let arr2 = [];
      let colors1 = [];
      let colors2 = [];

      if (res && res.length > 0) {
        res.forEach((val) => {
          this.chartData.labels.push(val.day);
          arr1.push(val.sales);
          colors1.push("#029E43");
        });

        this.chartData.datasets[0].data = arr1;
        this.chartData.datasets[0].backgroundColor = colors1;
      }
      if (res && res.length > 0) {
        res.forEach((val) => {
          arr2.push(val.purchases);
          colors2.push("#F44336");
        });

        this.chartData.datasets[1].data = arr2;
        this.chartData.datasets[1].backgroundColor = colors2;
      }
    },
  },
};
</script>
