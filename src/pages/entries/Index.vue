<template>
  <div class="q-pa-md">
    <div class="text-center">
      <b>ENTRIES</b>
    </div>
    <q-separator />
    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-4 q-mb-sm q-pa-sm">
        <q-card class="q-pa-sm">
          <q-card-actions>
            <router-link to="/today_entries" class="r-links">
              <q-icon name="content_paste" size="sm" class="q-mr-md" />
              Today</router-link
            >
            <q-space />
            <small>companies : {{ companies?.length }}</small>
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4 col-md-4 q-mb-sm q-pa-sm">
        <q-card class="q-pa-sm">
          <q-card-actions>
            <router-link to="/all_entries" class="r-links">
              <q-icon name="content_paste" size="sm" class="q-mr-md" />

              Summaried Sales</router-link
            >
            <q-space />
            <small>Sales : {{ all_entries?.length }}</small>
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4 col-md-4 q-mb-sm q-pa-sm">
        <q-card class="q-pa-sm">
          <q-card-actions>
            <router-link to="/entries_reports" class="r-links">
              <q-icon name="content_paste" size="sm" class="q-mr-md" />

              Master Sales</router-link
            >
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore as store } from "src/stores/user-store";
export default {
  preFetch({ currentRoute, previousRoute, redirect }) {
    const userStore = store();
    !userStore?.user && redirect({ path: "/" });
  },
};
</script>

<script setup>
import { ref } from "vue";
import { useQuery } from "vue-query";
import { fetchData } from "src/utilities/commonMethods";

const companies = ref([]);
const { data, isLoading, isError } = useQuery(
  "company_entries",
  () => fetchData("company_entries"),
  {
    onSuccess: (data) => (companies.value = Object.values(data)),
  }
);

const { data: all_entries } = useQuery("entries", () => fetchData("entries"));
</script>

<style>
.r-links {
  text-decoration: none;
  color: #029e43;
  font-weight: bolder;
}
</style>
