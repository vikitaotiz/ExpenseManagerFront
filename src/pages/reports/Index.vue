<template>
  <div class="q-pa-md">
    <q-card class="bg-primary text-white q-ma-xs">
      <q-card-actions>
        <div>Entry Reports</div>
        <q-spinner-grid v-if="loading" class="q-ml-lg" size="20px" color="white" />
        <q-space />
        <div>From {{ model?.from }}: to {{ model?.to }}</div>
        <q-space />
        <q-btn icon="event" rounded color="blue" @click="datePickerDialog = true" />
      </q-card-actions>
    </q-card>

    <q-table
      title="Entries"
      :rows="entries"
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

    <q-dialog v-model="datePickerDialog" persistent>
      <q-card>
        <q-date v-model="model" range />
        <q-card-actions>
          <q-btn
            dense
            @click="datePickerDialog = false"
            label="Cancel"
            color="red"
            flat
          />
          <q-space />
          <q-btn dense @click="submitDateRange" label="Submit" color="primary" flat />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { baseUrl, headers } from "src/utilities/constants";
import { ref } from "vue";
import { useMutation } from "vue-query";
// const currentDate = new Date().toLocaleDateString("zh-Hans-CN");

const datePickerDialog = ref(false);
const model = ref();
const filter = ref("");
const loading = ref(false);
const entries = ref([]);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 15,
});

const fetchDataInDateRange = async (data) => {
  const res = await fetch(`${baseUrl}/entries_report`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  return result;
};

const submitDateRange = () => {
  const data = {
    from: model.value.from.replace(/\//g, "-"),
    to: model.value.to.replace(/\//g, "-"),
  };

  mutate(data);
  loading.value = true;
};

const { mutate } = useMutation((data) => fetchDataInDateRange(data), {
  onSuccess: (data) => {
    datePickerDialog.value = false;
    entries.value = data.data;
    loading.value = false;
  },
});

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
</script>
