<template>
  <div class="text-center"><b>Category Products</b></div>
  <q-separator color="primary" />

  <vue3-chart-js v-bind="{ ...doughnutChart }" />
</template>

<script setup>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import { fetchData, getRandomColor } from "src/utilities/commonMethods";
import { reactive, onMounted } from "vue";
// import { useQuery } from "vue-query";

const doughnutChart = reactive({
  type: "doughnut",
  data: {
    labels: [],
    datasets: [
      {
        backgroundColor: [],
        data: [],
      },
    ],
  },
});

const fetchCategories = async () => {
  const res = await fetchData("categories");
  let arr = [];
  let colors = [];

  res.forEach((val) => {
    doughnutChart.data.labels.push(val.title);
    arr.push(val.products);
    colors.push(getRandomColor());
  });

  doughnutChart.data.datasets[0].data = arr;
  doughnutChart.data.datasets[0].backgroundColor = colors;

  console.log(doughnutChart.data);
};

onMounted(() => fetchCategories());
</script>
