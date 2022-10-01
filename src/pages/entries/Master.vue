<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-xs-12 q-pa-sm" :class="{ 'col-sm-7 col-md-7': entries.length > 1 }">
        <q-card class="bg-blue text-white q-mb-md" flat>
          <q-card-actions>
            <q-btn @click="$router.back()" icon="arrow_back" dense flat label="Back" />
            <q-space />
            <b
              ><code>(All Entries - {{ entries.length }})</code>
            </b>
            <q-space />
          </q-card-actions>
          <q-separator color="yellow" />
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
              <q-item-section>Gross profit</q-item-section>
              <q-item-section avatar>
                {{ computedProfit }}
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>Average Percentage Profit</q-item-section>
              <q-item-section avatar>
                {{
                  computedTotalProductionCost / computedTotalUsageCost
                    ? (
                        (computedTotalProductionCost / computedTotalUsageCost) *
                        100
                      ).toFixed(2)
                    : 0
                }}
                %
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-5 col-md-5 q-pa-sm" v-if="entries.length > 1">
        <q-expansion-item
          class="shadow-1 overflow-hidden"
          icon="location_city"
          label="Filter Data"
          header-class="bg-orange text-white"
          expand-icon-class="text-white"
          dense
        >
          <q-card bordered flat class="q-pa-sm">
            <q-table
              dense
              grid
              :rows="companies"
              row-key="name"
              :filter="filterCompanies"
              hide-header
            >
              <template #top>
                <q-input
                  outlined
                  rounded
                  dense
                  debounce="300"
                  v-model="filterCompanies"
                  placeholder="Search Company"
                />
              </template>
              <template v-slot:item="props">
                <q-btn
                  @click="filterCompany(props.row)"
                  size="xs"
                  rounded
                  :color="props.row.clicked ? 'orange' : 'primary'"
                  :label="props.row.name"
                  unelevated
                  class="q-ma-sm col-xs-6 col-sm-3 col-md-3"
                />
              </template>
            </q-table>
          </q-card>
        </q-expansion-item>
      </div>
    </div>

    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>

    <q-table
      v-else
      :rows="entries"
      :columns="company_entry_columns"
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
          class="q-ma-sm"
        />
        <q-input
          v-if="entries.length > 1"
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
      <template v-slot:top-left>
        <q-btn
          v-if="reset"
          dense
          flat
          color="orange"
          icon="autorenew"
          label="Reset"
          @click="resetEntries()"
        />
        <q-btn
          rounded
          v-if="entries.length > 0"
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
    </q-table>
  </div>
</template>

<script>
import { useUserStore as store } from "src/stores/user-store";
import { headers } from "src/utilities/constants";

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
import { fetchData, notifyUser } from "src/utilities/commonMethods";
import { exportExcel } from "src/utilities/exportExcel";
import { exportDataToPdf } from "src/utilities/exportPdf";

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const entries = ref([]);
const entries_data = ref([]);

const { isLoading, isError, error } = useQuery("entries", () => fetchData("entries"), {
  onSuccess: (data) => {
    entries_data.value = data;
    entries.value = data;
  },
});

const companies = ref([]);
useQuery("companies", () => fetchData("companies"), {
  onSuccess: (data) => {
    companies.value = data
      .filter((e) => e.entries.length > 0)
      .map((val) => {
        return {
          name: val.name,
          clicked: false,
        };
      });
  },
});

const pagination = ref(util_pagination(15));

const filter = ref("");
const filterCompanies = ref("");
const reset = ref(false);

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
  exportExcel(entries.value, company_entry_columns, $q, excel_name.value);

const filterCompany = (row) => {
  row.clicked = true;
  reset.value = true;
  entries.value = entries_data.value;
  entries.value = entries.value.filter((val) => val.company == row.name);
  if (entries.value.length < 1)
    notifyUser($q, `${row.name} has no entries yet.`, "top", "red");
};

const resetEntries = () => {
  entries.value = entries_data.value;
  reset.value = false;
};

const columns = company_entry_columns.map((val) => val.name);

const exportPdf = () => exportDataToPdf(entries.value, columns, "All Entries");
</script>
