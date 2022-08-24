<template>
  <div class="q-pa-md">
    <q-card class="bg-blue text-white q-mb-md">
      <q-card-actions>
        <q-btn @click="$router.back()" icon="arrow_back" dense flat label="Back" />
        <q-space />
        <b>
          <small
            ><code>(All Entries - {{ entries.length }})</code></small
          >
        </b>
        <q-space />
      </q-card-actions>
      <q-separator color="orange" />
      <q-list bordered separator dense>
        <q-item>
          <q-item-section>Total Production Cost</q-item-section>
          <q-item-section avatar>
            {{ computedTotalProductionCost }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Total Usage/Sales cost</q-item-section>
          <q-item-section avatar>
            {{ computedTotalUsageCost }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Net profit</q-item-section>
          <q-item-section avatar>
            {{ computedProfit }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Average Percentage Profit</q-item-section>
          <q-item-section avatar>
            {{
              computedProfit / computedTotalProductionCost
                ? ((computedProfit / computedTotalProductionCost) * 100).toFixed(2)
                : 0
            }}
            %
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else
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
        <q-btn
          rounded
          v-if="entries.length > 0"
          dense
          unelevated
          color="orange"
          icon-right="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
          class="q-mr-md"
        />
        <q-input
          v-if="entries.length > 0"
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
import { exportExcel } from "src/utilities/exportExcel";
export default {
  preFetch({ currentRoute, previousRoute, redirect }) {
    const userStore = store();
    !userStore?.user && redirect({ path: "/" });
  },
};
</script>

<script setup>
import { ref, computed } from "vue";
import { useQuery } from "vue-query";
import { exportFile, useQuasar } from "quasar";

import { useRouter, useRoute } from "vue-router";
import { company_entry_columns } from "src/utilities/columns/company_entry_columns";
import { util_pagination } from "src/utilities/util_pagination";
import { fetchData } from "src/utilities/commonMethods";

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const entries = ref([]);

const { data, isLoading, isError, error } = useQuery(
  "entries",
  () => fetchData("entries"),
  {
    onSuccess: (data) => (entries.value = data),
  }
);

const pagination = ref(util_pagination(15));

const filter = ref("");

const computedTotalProductionCost = computed(() => {
  return entries.value.reduce((a, b) => a + Number(b.unit_price) * Number(b.usage), 0);
});

const computedTotalUsageCost = computed(() => {
  return entries.value.reduce((a, b) => a + Number(b.selling_price) * Number(b.usage), 0);
});

const computedProfit = computed(() => {
  const buying_price = entries.value.reduce(
    (a, b) => a + Number(b.unit_price) * Number(b.usage),
    0
  );
  const selling_price = entries.value.reduce(
    (a, b) => a + Number(b.selling_price) * Number(b.usage),
    0
  );
  return selling_price - buying_price;
});

const excel_name = ref("All Entries");

const exportTable = () =>
  exportExcel(entries.value, company_entry_columns, $q, exportFile, excel_name.value);
</script>
