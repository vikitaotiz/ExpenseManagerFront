<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else-if="data"
      :title="`${data?.data?.name?.toUpperCase()} entries`"
      :rows="data?.data?.entries"
      :columns="columns"
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

<script setup>
import { ref } from "vue";
import { useQuery } from "vue-query";
import { getSingle } from "src/utilities/fetchWrapper.js";
import { useUserStore } from "src/stores/user-store.js";
import { useRouter, useRoute } from "vue-router";

const userStore = useUserStore();

const router = useRouter();
const route = useRoute();

const { data, isLoading, isError, error } = useQuery(["entries", route.params.slug], () =>
  getSingle("entries", route.params.slug)
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
    name: "product",
    required: true,
    label: "Product",
    align: "left",
    field: (row) => row.product,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "parts",
    align: "center",
    label: "Measurement",
    field: "parts",
    sortable: true,
  },
  { name: "units", label: "Unit", field: "units", sortable: true },
  { name: "unit_price", label: "Unit Price", field: "unit_price", sortable: true },
  {
    name: "opening_stock",
    label: "Opening Stock",
    field: "opening_stock",
    sortable: true,
  },
  {
    name: "closing_stock",
    label: "Closing Stock",
    field: "closing_stock",
    sortable: true,
  },
  { name: "purchases", label: "Purchases", field: "purchases", sortable: true },
  {
    name: "purchases_cost",
    label: "Purchases Cost",
    field: "purchases_cost",
    sortable: true,
  },
  {
    name: "closing_stock_cost",
    label: "Closing Stock Cost",
    field: "closing_stock_cost",
    sortable: true,
  },
  { name: "usage", label: "Usage", field: "usage", sortable: true },
  { name: "usage_cost", label: "Usage Cost", field: "usage_cost", sortable: true },
  { name: "system_usage", label: "System Usage", field: "system_usage", sortable: true },
  { name: "user", label: "User", field: "user", sortable: true },
  { name: "created_at", label: "Created On", field: "created_at", sortable: true },
];

// entriesStore.fetchAllentries();

// 'product' => $this->product->name,
//             'units' => $this->units,
//             'parts' => $this->parts,

//             'unit_price' => $this->unit_price,
//             'opening_stock' => $this->opening_stock,
//             'closing_stock' => $this->closing_stock,
//             'purchases' => $this->purchases,
//             'purchases_cost' => $this->purchases_cost,
//             'closing_stock_cost' => $this->closing_stock_cost,
//             'usage' => $this->usage,
//             'usage_cost' => $this->usage_cost,
//             'system_usage' => $this->system_usage,
//             'stock_shortage' => $this->stock_shortage,
//             'stock_shortage_cost' => $this->stock_shortage_cost,
//             'user' => $this->user->name,
//             "company" => $this->company->name,
//             "created_at" => $this->created_at->format('H:m A, jS D M Y')
</script>
