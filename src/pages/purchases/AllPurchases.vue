<template>
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-md-6">
      <CommonHeader :section_title="`All Purchases : Ksh ${computedAllTotal}`" />
    </div>
    <div class="col-xs-12 col-sm-6 col-md-6">
      <q-card class="q-ma-md">
        <div v-if="loadingPayments">Loading payment modes</div>
        <div v-else-if="paymentsError">An error has occurred</div>
        <q-btn
          v-else
          @click="filterDataWithPaymentMode(mode)"
          unelevated
          dense
          v-for="mode in payment_modes"
          :label="mode.name"
          :key="mode.id"
          class="q-ma-sm"
          color="orange"
        />
      </q-card>
    </div>
  </div>

  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else
      :rows="purchases_data"
      :columns="purchases_columns"
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
        <q-btn
          rounded
          v-if="purchases_data.length > 0"
          dense
          unelevated
          color="blue"
          icon="assignment"
          label="Export to pdf"
          no-caps
          @click="exportPdf"
          class="q-ma-sm"
        />
        <q-btn
          rounded
          v-if="purchases_data.length > 0"
          dense
          unelevated
          color="orange"
          icon-right="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
          class="q-ma-sm"
        />
      </template>

      <template v-slot:top-left>
        <q-btn
          v-if="reset"
          dense
          flat
          color="orange"
          icon="autorenew"
          label="Reset"
          @click="resetPurchases()"
        />
      </template>
    </q-table>
  </div>
</template>

<script>
import { useUserStore as store } from "src/stores/user-store";

export default {
  preFetch({ redirect }) {
    const userStore1 = store();
    !userStore1?.user && redirect({ path: "/" });
  },
};
</script>

<script setup>
import { computed, ref } from "vue";
import { useQuery } from "vue-query";
import { useQuasar } from "quasar";

import { notifyUser } from "src/utilities/commonMethods";
import { getAll } from "src/utilities/fetchWrapper.js";
import { useUserStore } from "src/stores/user-store.js";
import { purchases_columns } from "src/utilities/columns/purchases_columns";
import { util_pagination } from "src/utilities/util_pagination";
import { exportExcel } from "src/utilities/exportExcel";
import { exportDataToPdf } from "src/utilities/exportPdf";
import CommonHeader from "src/components/CommonHeader.vue";

const userStore = useUserStore();
const $q = useQuasar();
const purchases_data = ref([]);
const purchases_data_copy = ref([]);
const reset = ref(false);

const { isLoading, isError, error } = useQuery(
  "purchases",
  () => getAll("all_purchases", userStore.user?.token),
  {
    onSuccess: (data) => {
      purchases_data.value = data;
      purchases_data_copy.value = data;
    },
  }
);

const payment_modes = ref([]);
const { isLoading: loadingPayments, isError: paymentsError } = useQuery(
  "payment_modes",
  () => getAll("payment_modes", userStore.user?.token),
  {
    onSuccess: (data) => (payment_modes.value = data),
  }
);

const computedAllTotal = computed(() =>
  purchases_data.value.reduce((a, b) => a + Number(b.total_amount), 0)
);

const pagination = ref(util_pagination(15));

const filter = ref("");

const excel_name = ref("All Purchases");
const exportTable = () =>
  exportExcel(
    purchases_data.value,
    purchases_columns.filter((val) => val.name !== "action"),
    $q,
    excel_name.value
  );

const columns = purchases_columns
  .map((val) => val.name)
  .filter((val) => val !== "action");

const exportPdf = () => exportDataToPdf(purchases_data.value, columns, "All Purchases");

const filterDataWithPaymentMode = (data) => {
  reset.value = true;
  purchases_data.value = purchases_data_copy.value;
  purchases_data.value = purchases_data.value.filter(
    (val) => val.payment_mode == data.name
  );
  if (purchases_data.value.length < 1)
    notifyUser($q, `${data.name} has no entries yet.`, "top", "red");
};

const resetPurchases = () => {
  purchases_data.value = purchases_data_copy.value;
  reset.value = false;
};
</script>
