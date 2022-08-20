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
      :columns="entries_report_columns"
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
import { ref } from "vue";
import { useMutation } from "vue-query";

import { entries_report_columns } from "src/utilities/columns/entries_report_columns";
import { baseUrl, headers } from "src/utilities/constants";
import { util_pagination } from "src/utilities/util_pagination";

// const currentDate = new Date().toLocaleDateString("zh-Hans-CN");

const datePickerDialog = ref(false);
const model = ref();
const filter = ref("");
const loading = ref(false);
const entries = ref([]);

const pagination = ref(util_pagination(15));

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
</script>
