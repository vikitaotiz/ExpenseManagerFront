<template>
  <div class="text-center"><b>Category Products</b></div>
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
  props: {
    token: {
      type: String,
    },
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
      const res = await fetchData("categories", this.token);
      let arr = [];
      let colors = [];
      if (res && res.length > 0) {
        res.forEach((val) => {
          this.chartData.labels.push(val.title);
          arr.push(val.products);
          colors.push(getRandomColor());
        });

        this.chartData.datasets[0].data = arr;
        this.chartData.datasets[0].backgroundColor = colors;
      }
    },
  },
};
</script>
