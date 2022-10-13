<template>
  <div class="q-pa-md">
    <q-card class="bg-primary text-white q-ma-xs">
      <q-card-actions>
        <q-btn @click="$router.back()" icon="arrow_back" dense flat label="Back" />
        <q-space />
        <div>Purchases Reports</div>
        <q-spinner-grid v-if="loading" class="q-ml-lg" size="20px" color="white" />
        <q-space />

        <div>From : <input type="date" v-model="report_date.from" :max="max_date" /></div>
        <div v-if="report_date.from">
          To :
          <input type="date" v-model="report_date.to" :max="max_date" />
        </div>
        <q-btn
          v-if="report_date.to"
          icon="event"
          unelevated
          dense
          label="Fetch"
          color="orange"
          @click="submitDateRange"
        />
      </q-card-actions>
    </q-card>

    <q-table
      v-if="purchases.length > 0"
      title="Entries"
      :rows="purchases"
      :columns="purchases_report_columns"
      row-key="product"
      separator="cell"
      v-model:pagination="pagination"
      :filter="filter"
      dense
      class="q-mt-sm"
    >
      <template v-slot:top-left>
        <q-btn
          rounded
          v-if="purchases.length > 0"
          dense
          unelevated
          color="blue"
          icon="assignment"
          label="Export to pdf"
          no-caps
          @click="exportPdf"
          class="q-ma-sm"
        />
      </template>
      <template v-slot:top-right>
        <q-btn
          rounded
          v-if="purchases.length > 0"
          dense
          unelevated
          color="orange"
          icon-right="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
          class="q-ma-sm"
        />
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
  preFetch({ redirect }) {
    const userStore = store();
    !userStore?.user && redirect({ path: "/" });
  },
};
</script>

<script setup>
import { ref, reactive } from "vue";
import { useMutation } from "vue-query";
import { useQuasar } from "quasar";

import { purchases_report_columns } from "src/utilities/columns/purchases_report_columns";
import { baseUrl, headers } from "src/utilities/constants";
import { util_pagination } from "src/utilities/util_pagination";
import { exportExcel } from "src/utilities/exportExcel";
import { exportDataToPdf } from "src/utilities/exportPdf";

const max_date = new Date().toISOString().split("T")[0];

const report_date = reactive({
  from: "",
  to: "",
});

const datePickerDialog = ref(false);
const model = ref();
const filter = ref("");
const loading = ref(false);
const purchases = ref([]);
const $q = useQuasar();
const excel_name = ref("");

const pagination = ref(util_pagination(15));

const fetchDataInDateRange = async (data) => {
  const res = await fetch(`${baseUrl}/purchases_report`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return result;
};

const submitDateRange = () => {
  const data = {
    from: report_date.from,
    to: report_date.to,
  };

  mutate(data);
  loading.value = true;
  excel_name.value = `Purchases-Data-${data.from}-${data.to}`;
};

const { mutate } = useMutation((data) => fetchDataInDateRange(data), {
  onSuccess: (data) => {
    datePickerDialog.value = false;
    purchases.value = data.data;
    loading.value = false;
  },
});

const exportTable = () =>
  exportExcel(purchases.value, purchases_report_columns, $q, excel_name.value);

const columns = purchases_report_columns.map((val) => val.name);

const exportPdf = () => exportDataToPdf(purchases.value, columns, excel_name.value);
</script>
