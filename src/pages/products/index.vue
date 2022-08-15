<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else-if="data"
      title="All Products"
      :rows="data"
      :columns="columns"
      :grid="$q.screen.xs"
      row-key="name"
      separator="cell"
      v-model:pagination="pagination"
      :filter="filter"
      dense
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-icon
            color="red"
            name="delete"
            @click="deleteProduct(props.row)"
            style="cursor: pointer"
            size="20px"
          />
        </q-td>
      </template>
      <template v-slot:top-right>
        <q-spinner-grid v-if="loading" class="q-mr-lg" size="20px" />

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
import { getAll } from "src/utilities/fetchWrapper.js";
import { useUserStore } from "src/stores/user-store.js";

import { useQuasar } from "quasar";
import { useQuery, useMutation, useQueryClient } from "vue-query";

const userStore = useUserStore();
const queryClient = useQueryClient();
const $q = useQuasar();

const { data, isLoading, isError, error } = useQuery("products", () =>
  getAll("products", userStore.user?.token)
);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 15,
});

const filter = ref("");
const loading = ref(false);
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
    name: "description",
    align: "center",
    label: "Description",
    field: "description",
    sortable: true,
  },
  { name: "category", label: "Category", field: "category", sortable: true },
  { name: "unit", label: "Unit", field: "unit", sortable: true },
  { name: "company", label: "Company", field: "company", sortable: true },
  { name: "created_at", label: "Created On", field: "created_at", sortable: true },
  { name: "action", label: "Action", align: "center" },
];

const deleteProduct = (row) => {
  const delete_product = confirm("Are you sure you want to delete " + row.name + "?");
  if (delete_product) {
    loading.value = true;
    removProduct(row.id);
  }
};

const { mutate: removProduct } = useMutation((id) => deleteData(id, "products"), {
  onSuccess: (data) => {
    queryClient.refetchQueries(["categories", route.params.slug]);
    $q.notify({
      message: "Product deleted successfully.",
      color: "orange",
      position: "top-right",
    });
    loading.value = false;
  },
});
</script>
