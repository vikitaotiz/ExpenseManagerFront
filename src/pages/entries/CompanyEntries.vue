<template>
  <div class="q-pa-md">
    <q-card class="bg-primary text-white q-mb-md">
      <q-card-actions>
        <q-btn @click="$router.back()" icon="arrow_back" dense flat label="Back" />
        <q-space />
        <b>
          {{ data?.company_name?.toUpperCase() }} :
          <small
            ><code>(Entries - {{ data?.data?.length }})</code></small
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
          <q-item-section>Percentage profit</q-item-section>
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
      v-else-if="data"
      :rows="data?.data"
      :columns="today_entry_columns"
      :grid="$q.screen.xs"
      row-key="product"
      separator="cell"
      v-model:pagination="pagination"
      :filter="filter"
      dense
    >
      <template v-slot:top-right>
        <q-spinner-grid v-if="loading" class="q-mr-lg" size="20px" />
        <q-input
          v-if="data?.data.length > 1"
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

      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-icon color="info" name="edit" style="cursor: pointer" size="20px" />
        </q-td>
      </template>
      <template v-slot:body-cell-delete="props">
        <q-td :props="props">
          <q-icon
            color="red"
            name="delete"
            @click="deleteEntry(props.row)"
            style="cursor: pointer"
            size="20px"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { useUserStore as store } from "src/stores/user-store";
export default {
  preFetch({ currentRoute, previousRoute, redirect }) {
    const userStore = store();
    !userStore?.user && redirect({ path: "/" });
  },
};
</script>

<script setup>
import { ref, computed } from "vue";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import { useQuasar } from "quasar";

import { getSingle } from "src/utilities/fetchWrapper.js";
import { useUserStore } from "src/stores/user-store.js";
import { useRouter, useRoute } from "vue-router";
import { today_entry_columns } from "src/utilities/columns/today_entry_columns";
import { util_pagination } from "src/utilities/util_pagination";
import { deleteData, notifyUser } from "src/utilities/commonMethods";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const queryClient = useQueryClient();
const $q = useQuasar();

const company_data = ref([]);

const { data, isLoading, isError, error } = useQuery(
  ["today_entries", route.params.slug],
  () => getSingle("today_entries", route.params.slug),
  {
    onSuccess: (data) => (company_data.value = data.data),
  }
);

const pagination = ref(util_pagination(15));

const filter = ref("");
const loading = ref(false);

const deleteEntry = (row) => {
  const delete_entry = confirm(`Are you sure you want to delete ${row.product}`);
  if (delete_entry) {
    loading.value = true;
    removeEntry(row.id);
  }
};

const { mutate: removeEntry } = useMutation((id) => deleteData(id, "entries"), {
  onSuccess: (data) => {
    queryClient.refetchQueries("entries");
    notifyUser($q, data.message, "top-right", "orange");
    loading.value = false;
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});

const computedTotalProductionCost = computed(() => {
  return company_data.value.reduce(
    (a, b) => a + Number(b.unit_price) * Number(b.usage),
    0
  );
});

const computedTotalUsageCost = computed(() => {
  return company_data.value.reduce(
    (a, b) => a + Number(b.selling_price) * Number(b.usage),
    0
  );
});

const computedProfit = computed(() => {
  const buying_price = company_data.value.reduce(
    (a, b) => a + Number(b.unit_price) * Number(b.usage),
    0
  );
  const selling_price = company_data.value.reduce(
    (a, b) => a + Number(b.selling_price) * Number(b.usage),
    0
  );
  return selling_price - buying_price;
});
</script>
