<template>
  <div class="text-center"><b>Company Total Sales</b></div>
  <q-separator color="primary" />
  <Doughnut :chart-options="chartOptions" :chart-data="chartData" />
</template>

<script>
import { Doughnut } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import { fetchData, getRandomColor } from "src/utilities/commonMethods";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: "DoughnutChart",
  components: {
    Doughnut,
  },

  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
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
      const res = await fetchData("company_charts");

      let arr = [];
      let colors = [];
      if (res && res.length > 0) {
        res.forEach((val) => {
          this.chartData.labels.push(val.name);
          arr.push(val.total_sales);
          colors.push(getRandomColor());
        });

        this.chartData.datasets[0].data = arr;
        this.chartData.datasets[0].backgroundColor = colors;
      }
    },
  },
};
</script>
