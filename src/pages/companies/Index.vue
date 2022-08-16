<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else-if="data"
      title="All Companies"
      :rows="data"
      :columns="columns"
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
import { ref } from "vue";
import { useQuery } from "vue-query";
import { getAll } from "src/utilities/fetchWrapper.js";
import { useUserStore } from "src/stores/user-store.js";
import { fetchData } from "src/utilities/commonMethods";

const userStore = useUserStore();

const { data, isLoading, isError, error } = useQuery("companies", () =>
  fetchData("companies", userStore.user?.token)
);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 15,
});

const filter = ref("");
const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "users",
    align: "center",
    label: "Numbers of Users",
    field: "users",
    sortable: true,
  },
  { name: "phone", label: "Phone", field: "phone", sortable: true },
  { name: "email", label: "Email", field: "email", sortable: true },
  { name: "address", label: "Address", field: "address", sortable: true },
  { name: "city", label: "City", field: "city", sortable: true },
  { name: "country", label: "Country", field: "country", sortable: true },
  { name: "created_at", label: "Created On", field: "created_at", sortable: true },
];
</script>