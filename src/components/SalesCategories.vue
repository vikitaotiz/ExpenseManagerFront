<template>
  <div class="text-center"><b>Sales Categories</b></div>
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
    groupByCategory(arr, key) {
      return arr.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },

    total_category_selling_prices(arr) {
      return Array.isArray(arr)
        ? arr.reduce((a, b) => a + Number(b.selling_price), 0)
        : 0;
    },

    async fetchCategories() {
      const res = await fetchData("sales_categories");

      const data1 = this.groupByCategory(res, "category");
      const data2 = Object.keys(data1).map((key) => {
        return { name: key, sales: this.total_category_selling_prices(data1[key]) };
      });

      let arr = [];
      let colors = [];
      if (data2 && data2.length > 0) {
        data2.forEach((val) => {
          this.chartData.labels.push(val.name);
          arr.push(val.sales);
          colors.push(getRandomColor());
        });

        this.chartData.datasets[0].data = arr;
        this.chartData.datasets[0].backgroundColor = colors;
      }
    },
  },
};
</script>
