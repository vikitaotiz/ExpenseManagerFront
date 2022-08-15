<template>
  <div>
    <q-card flat class="q-pa-md q-mb-md text-center">
      <b class="myColor">All Entries: {{ all_entries?.length }}</b></q-card
    >
    <q-card flat class="q-pa-md q-mb-md text-center">
      <b class="myColor">Today's Entries: {{ today_entries?.length }}</b>
    </q-card>
    <q-card flat class="q-pa-md q-mb-md text-center">
      <b class="myColor">Categories: {{ categories?.length }}</b>
    </q-card>
    <q-card flat class="q-pa-md q-mb-md text-center">
      <b class="myColor"> Products: {{ products?.length }}</b>
    </q-card>
    <q-card flat class="q-pa-md q-mb-md text-center">
      <b class="myColor">Companies: {{ companies?.length }}</b>
    </q-card>
    <q-card flat class="q-pa-md text-center">
      <b class="myColor">Users: {{ users?.length }}</b>
    </q-card>
  </div>
</template>
<script setup>
import { fetchData } from "src/utilities/commonMethods";
import { useQuery } from "vue-query";

const { data: all_entries } = useQuery("entries", () => fetchData("entries"));
const { data: today_entries } = useQuery("today_entries", () =>
  fetchData("today_entries")
);
const { data: categories } = useQuery("categories", () => fetchData("categories"));
const { data: products } = useQuery("products", () => fetchData("products"));
const { data: companies } = useQuery("companies", () => fetchData("companies"));
const { data: users } = useQuery("users", () => fetchData("users"));
</script>

<style>
.myColor {
  color: #029e43;
}
</style>
