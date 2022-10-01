<template>
  <CommonHeader
    :section_title="`Today Entries : (Quantities : ${total_entries_quantities}) : Ksh ${total_entries_amount}`"
  />
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-md-6 q-pa-sm">
      <q-card class="q-pa-sm text-center"
        ><b style="color: #029e43">Sales By Item Group</b>
        <q-separator color="orange" />
        <table style="width: 100%">
          <thead>
            <th>Categories</th>
            <th>Percentage</th>
            <th>Total Amount</th>
          </thead>
          <tbody>
            <tr
              v-for="entry in today_entries"
              :key="entry.name"
              style="text-align: center"
            >
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
          ><b style="color: #029e43">Quantities By Item Group</b>
          <q-separator color="orange" />
          <table style="width: 100%">
            <thead>
              <th>Categories</th>
              <th>Quantities %</th>
              <th>Quantities</th>
            </thead>
            <tbody>
              <tr
                v-for="entry in today_entries"
                :key="entry.name"
                style="text-align: center"
              >
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
    :rows="today_entries"
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
import { ref, computed } from "vue";
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";

import CommonHeader from "src/components/CommonHeader.vue";
import { getSingle } from "src/utilities/fetchWrapper";
import { util_pagination } from "src/utilities/util_pagination";
import { sales_category_columns } from "src/utilities/columns/sales_category_columns";

const route = useRoute();
const today_entries = ref([]);
const loading = ref(false);
const filter = ref("");
const pagination = ref(util_pagination(10));

const total_entries = ref("");

useQuery(
  ["today_entries", route.params.slug],
  () => getSingle("today_entries", route.params.slug),
  {
    onSuccess: (data) => {
      console.log(data);
      total_entries.value = data.data;
      const data1 = groupByCategory(data.data, "category");
      today_entries.value = Object.keys(data1).map((key) => {
        return { name: key, entry_data: data1[key] };
      });
    },
  }
);

const groupByCategory = (arr, key) => {
  return arr.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
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
</script>
