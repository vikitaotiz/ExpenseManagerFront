<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else-if="data"
      title="All Companies"
      :rows="data"
      :columns="company_columns"
      :grid="$q.screen.xs"
      row-key="name"
      separator="cell"
      v-model:pagination="pagination"
      :filter="filter"
      dense
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          outlined
          rounded
          debounce="300"
          v-model="filter"
          placeholder="Search"
          class="q-mr-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn round dense color="primary" size="small" icon="add" />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuery } from "vue-query";

import { fetchData } from "src/utilities/commonMethods";
import { company_columns } from "src/utilities/columns/company_columns";
import { util_pagination } from "src/utilities/util_pagination";

const { data, isLoading, isError, error } = useQuery("companies", () =>
  fetchData("companies")
);

const pagination = ref(util_pagination(15));

const filter = ref("");
</script>

<script>
import { useUserStore as store } from "src/stores/user-store";
export default {
  preFetch({ currentRoute, previousRoute, redirect }) {
    const store = store();
    !store?.user && redirect({ path: "/" });
  },
};
</script>
