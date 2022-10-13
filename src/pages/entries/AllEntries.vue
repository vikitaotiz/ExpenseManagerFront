<template>
  <q-card class="bg-primary text-white q-ma-xs">
    <q-card-actions>
      <q-btn @click="$router.back()" icon="arrow_back" dense flat label="Back" />
      <q-space />
      <div>Sales Reports</div>
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
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-md-6 q-pa-sm">
      <q-card class="q-pa-sm text-center"
        >Sales By Item Group
        <q-separator />
        <table style="width: 100%">
          <thead>
            <th>Categories</th>
            <th>Percentage</th>
            <th>Total Amount</th>
          </thead>
          <tbody>
            <tr v-for="entry in entries" :key="entry.name" style="text-align: center">
              <td>{{ entry.name }}</td>
              <td>
                {{
                  (
                    (total_category_entries_amount(entry.entry_data) /
                      total_entries_amount) *
                    100
                  ).toFixed(2)
                }}
                %
              </td>
              <td>{{ total_category_entries_amount(entry.entry_data) }}</td>
            </tr>
          </tbody>
        </table>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-6 q-pa-sm">
      <q-card class="q-pa-sm">
        <q-card class="q-pa-sm text-center"
          >Quantities By Item Group
          <q-separator />
          <table style="width: 100%">
            <thead>
              <th>Categories</th>
              <th>Quantities %</th>
              <th>Quantities</th>
            </thead>
            <tbody>
              <tr v-for="entry in entries" :key="entry.name" style="text-align: center">
                <td>{{ entry.name }}</td>
                <td>
                  {{
                    ((entry.entry_data.length / total_entries_quantities) * 100).toFixed(
                      2
                    )
                  }}
                </td>
                <td>
                  {{ entry.entry_data.length }}
                </td>
              </tr>
            </tbody>
          </table>
        </q-card>
      </q-card>
    </div>
  </div>
  <q-separator color="primary" />
  <q-table
    grid
    title="Sales Categories"
    :rows="entries"
    row-key="name"
    :filter="filter"
    hide-header
    v-model:pagination="pagination"
  >
    <template v-slot:top-right>
      <q-spinner-grid v-if="loading" class="q-mr-lg" size="30px" color="primary" />

      <q-input
        borderless
        dense
        outlined
        rounded
        debounce="300"
        v-model="filter"
        placeholder="Search"
        class="q-mr-md"
        autofocus
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <q-separator />

    <template v-slot:item="props">
      <q-expansion-item
        class="col-xs-12 col-sm-6 col-md-3 q-ma-sm"
        style="border-radius: 30px"
        :label="`${props.row.name} : ${total_category_entries_amount(
          props.row.entry_data
        )}`"
        header-class="bg-primary text-white"
        expand-icon-class="text-white"
      >
        <q-card>
          <q-card-section>
            <q-table
              flat
              dense
              :rows="props.row.entry_data"
              :columns="sales_category_columns"
              bordered
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </template>
  </q-table>
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
import { ref, computed, reactive } from "vue";
import { useMutation, useQuery } from "vue-query";
import { fetchData } from "src/utilities/commonMethods";

import { util_pagination } from "src/utilities/util_pagination";
import { sales_category_columns } from "src/utilities/columns/sales_category_columns";
import { baseUrl } from "src/utilities/constants";
import { headers } from "src/utilities/constants";

const entries = ref([]);
const loading = ref(false);
const filter = ref("");
const pagination = ref(util_pagination(10));

const total_entries = ref("");

const max_date = new Date().toISOString().split("T")[0];

const report_date = reactive({
  from: "",
  to: "",
});

useQuery("entries", () => fetchData("entries"), {
  onSuccess: (data) => {
    total_entries.value = data;
    const data1 = groupByCategory(data, "category");
    entries.value = sortCategory(data1);
  },
});

const groupByCategory = (arr, key) => {
  return arr.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const sortCategory = (data) => {
  const result = Object.keys(data).map((key) => {
    return { name: key, entry_data: data[key] };
  });
  return result;
};

const total_entries_amount = computed(() => {
  const tt = JSON.parse(JSON.stringify(total_entries.value));
  return Array.isArray(tt) ? tt.reduce((a, b) => a + Number(b.usage_cost), 0) : 0;
});

const total_entries_quantities = computed(() => {
  const tt = JSON.parse(JSON.stringify(total_entries.value));
  return Array.isArray(tt) ? tt.reduce((a, b) => a + Number(b.usage), 0) : 0;
});

const total_category_entries_amount = (arr) => {
  return Array.isArray(arr) ? arr.reduce((a, b) => a + Number(b.usage_cost), 0) : 0;
};

const total_category_entry_quanntities = (arr) => {
  return Array.isArray(arr) ? arr.reduce((a, b) => a + Number(b.usage), 0) : 0;
};

const percentage_qty_category = (amt) => {
  return Number(amt) / Number(total_entries_amount);
};

const submitDateRange = () => {
  const data = {
    from: report_date.from,
    to: report_date.to,
  };

  mutate(data);
  loading.value = true;
};

const { mutate } = useMutation((data) => fetchDataInDateRange(data), {
  onSuccess: (data) => {
    entries.value = data.data;
    loading.value = false;
    const data1 = groupByCategory(data.data, "category");
    entries.value = sortCategory(data1);
  },
});

const fetchDataInDateRange = async (data) => {
  const res = await fetch(`${baseUrl}/get_sales`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return result;
};
</script>
