<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred</div>
    <q-table
      v-else
      grid
      title="Companies/Businesses with entries"
      :rows="companies"
      row-key="title"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
    >
      <template v-slot:top-right>
        <q-btn
          label="View All Companies"
          size="sm"
          flat
          color="primary"
          to="/companies"
          class="q-mr-md"
        />
        <q-input
          v-if="companies.length > 1"
          borderless
          dense
          outlined
          rounded
          debounce="300"
          v-model="filter"
          placeholder="Search"
          class="q-ma-sm"
          autofocus
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <q-separator />

      <template v-slot:item="props">
        <router-link
          :to="`/company_entries/${props.row.slug}`"
          class="q-pa-xs col-xs-12 col-sm-6 col-md-3"
          style="text-decoration: none"
        >
          <q-card style="cursor: pointer" class="mycard">
            <q-card-section class="text-center">
              <b>{{ props.row.name.toUpperCase() }}</b>
            </q-card-section>
            <q-separator color="orange" />
            <q-card-section>
              <small
                ><b>Entries : {{ props.row.entry_count }}</b></small
              >
            </q-card-section>
          </q-card>
        </router-link>
      </template>
    </q-table>
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
import { util_pagination } from "src/utilities/util_pagination";

const pagination = ref(util_pagination(10));
const filter = ref("");
const companies = ref([]);

const { data, isLoading, isError } = useQuery(
  "company_today_entries",
  () => fetchData("company_entries"),
  {
    onSuccess: (data) => (companies.value = Object.values(data)),
  }
);
</script>

<style>
.mycard {
  text-decoration: none;
  background: #029e43;
  color: white;
}

.mycard:hover {
  background: #fff;
  color: #029e43;
}
</style>
