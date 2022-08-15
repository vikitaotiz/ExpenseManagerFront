<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-4 q-pa-sm">
        <q-card class="q-pa-sm"><DoughnutChart /></q-card>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4 q-pa-sm">
        <q-card class="q-pa-sm bg-orange">
          <Stats />
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4 q-pa-sm">
        <q-card class="q-pa-md">
          <BarChart />
        </q-card>
      </div>
    </div>
    <q-separator class="q-mt-sm q-mb-sm" color="primary" />
    <q-card class="q-pa-md"> <MiniReport /> </q-card>
  </div>
</template>

<script setup>
import DoughnutChart from "src/components/DoughnutChart.vue";
import BarChart from "src/components/BarChart.vue";
import Stats from "src/components/Stats.vue";
import MiniReport from "src/components/MiniReport.vue";
</script>
