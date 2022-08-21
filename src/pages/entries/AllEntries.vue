<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else
      title="All Entries"
      :rows="data"
      :columns="company_entry_columns"
      :grid="$q.screen.xs"
      row-key="product"
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

import { useUserStore } from "src/stores/user-store.js";
import { useRouter, useRoute } from "vue-router";
import { company_entry_columns } from "src/utilities/columns/company_entry_columns";
import { util_pagination } from "src/utilities/util_pagination";
import { fetchData } from "src/utilities/commonMethods";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const { data, isLoading, isError, error } = useQuery("entries", () =>
  fetchData("entries", userStore?.user?.token)
);

const pagination = ref(util_pagination(15));

const filter = ref("");
</script>
