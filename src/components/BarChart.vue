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
            label: "Total Entries",
            backgroundColor: "#029E43",
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
      let arr = [];
      let colors = [];
      if (res && res.length > 0) {
        res.forEach((val) => {
          this.chartData.labels.push(val.day);
          arr.push(val.records);
          colors.push(getRandomColor());
        });

        this.chartData.datasets[0].data = arr;
        this.chartData.datasets[0].backgroundColor = colors;
      }
    },
  },
};
</script>
