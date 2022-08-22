<template>
  <div>
    <small v-if="usage_difference !== 0" class="text-red q-pa-sm text-center" flat>
      <b>There is a difference between actual usage/sales and system Usage</b>
    </small>
    <div class="row">
      <div class="col-xs-12 col-sm-3 col-md-3 q-pa-sm">
        <q-card flat class="bg-orange text-white q-pa-sm">
          Purchases Cost : {{ entry.unit_price * entry.purchases }}
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-pa-sm">
        <q-card flat class="bg-orange text-white q-pa-sm">
          Usage Cost : {{ entry.unit_price * usage }}
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-pa-sm">
        <q-card flat class="bg-orange text-white q-pa-sm">
          Opening Stock Cost : {{ entry.unit_price * entry.opening_stock }}
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-pa-sm">
        <q-card flat class="bg-orange text-white q-pa-sm">
          Closing Stock Cost : {{ entry.unit_price * entry.closing_stock }}
        </q-card>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-3 col-md-3 q-pa-sm">
        <q-card flat class="bg-orange text-white q-pa-sm">
          Sales Value : {{ entry.selling_price * usage }}
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-pa-sm" v-if="percentage_profit > 0">
        <q-card flat class="bg-primary text-white q-pa-sm">
          Percentage Profit : {{ percentage_profit }} %
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-pa-sm" v-if="percentage_profit < 0">
        <q-card flat class="bg-red text-white q-pa-sm">
          Percentage Loss : {{ percentage_profit }} %
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-pa-sm" v-if="percentage_profit == 0">
        <q-card flat class="bg-blue text-white q-pa-sm">
          No Loss of Profit: {{ percentage_profit }} %
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const { entry } = defineProps(["entry"]);

const usage = computed(() => {
  entry.usage = parseInt(entry.opening_stock - entry.closing_stock)
    ? parseInt(entry.opening_stock - entry.closing_stock)
    : parseInt(0);

  return entry.usage;
});

const percentage_profit = computed(() => {
  let num = parseInt(entry.opening_stock - entry.closing_stock)
    ? parseInt(entry.opening_stock - entry.closing_stock)
    : 0;

  let profit = 0;

  let buying_price = num * entry.unit_price;
  let selling_price = num * entry.selling_price;
  profit = ((selling_price - buying_price) / buying_price) * 100;
  return profit ? profit.toFixed(2) : 0;
});

const usage_difference = computed(() => {
  let num = parseInt(entry.opening_stock - entry.closing_stock)
    ? parseInt(entry.opening_stock - entry.closing_stock)
    : 0;
  return num - entry.system_usage;
});
</script>
