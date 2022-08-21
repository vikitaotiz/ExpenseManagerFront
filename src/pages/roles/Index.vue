<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else-if="data"
      title="All Roles"
      :rows="data"
      :columns="roles_columns"
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

import { getAll } from "src/utilities/fetchWrapper.js";
import { useUserStore } from "src/stores/user-store.js";
import { util_pagination } from "src/utilities/util_pagination";
import { roles_columns } from "src/utilities/columns/roles_columns";

const userStore = useUserStore();

const { data, isLoading, isError, error } = useQuery("roles", () =>
  getAll("roles", userStore.user?.token)
);

const pagination = ref(util_pagination(15));

const filter = ref("");
</script>
