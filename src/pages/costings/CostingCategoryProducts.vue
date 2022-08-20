<template>
  <div class="q-pa-md">
    <q-card class="bg-primary text-white">
      <q-card-actions>
        <q-btn
          @click="$router.back()"
          color="white"
          dense
          flat
          icon="arrow_back"
          label="Back "
        />
        <q-space />
        <div>
          <q-spinner-grid v-if="loading" class="q-mr-lg" size="20px" color="white" />
          <b>{{ category?.data?.title?.toUpperCase() }} </b>
        </div>
        <q-space />
        <q-input
          outlined
          borderless
          dense
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
      </q-card-actions>
    </q-card>
    <div v-if="isLoading">Loading...</div>
    <div v-if="isError">There was an error...</div>

    <q-table
      v-else
      grid
      :rows="category?.data?.products"
      row-key="title"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
    >
      <q-separator />

      <template v-slot:item="props">
        <div
          class="q-pa-sm col-xs-12 col-sm-6 col-md-3"
          style="text-decoration: none; color: #029e43"
          @click="openEntryDialog(props.row)"
        >
          <q-card style="cursor: pointer; border-radius: 10px">
            <q-list separator dense>
              <q-item>
                <q-item-section class="text-center">
                  <b>{{ props.row.name.toUpperCase() }}</b></q-item-section
                >
              </q-item>
              <q-item>
                <q-item-section>Units</q-item-section>
                <q-item-section avatar>
                  {{ props.row.unit }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>

    <NewEntryDialog
      v-model="entryDialog"
      @submitEntry="submitEntry()"
      :product="product"
      :entry="entry"
      :parts="parts"
      :errorMessage="errorMessage"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useQuery, useMutation } from "vue-query";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";

import { getSingle } from "src/utilities/fetchWrapper";
import { useEntryStore } from "src/stores/entry-store";
import { createNewEntry, fetchData, notifyUser } from "src/utilities/commonMethods";
import { useUserStore } from "src/stores/user-store";
import { util_pagination } from "src/utilities/util_pagination";
import NewEntryDialog from "src/components/EntryCostings/NewEntryDialog.vue";

const route = useRoute();
const router = useRouter();
const filter = ref("");
const errorMessage = ref("");
const loading = ref(false);
const entryDialog = ref(false);
const product = ref("");
const $q = useQuasar();
const entryStore = useEntryStore();
const userStore = useUserStore();

const pagination = ref(util_pagination(10));

const { data: category, isLoading, isError } = useQuery(
  ["categories", route.params.slug],
  () => getSingle("categories", route.params.slug)
);

const { data: parts } = useQuery("parts", () =>
  fetchData("parts", userStore?.user?.token)
);

const entry = reactive({
  unit_price: 0,
  purchases: 0,
  opening_stock: 0,
  closing_stock: 0,
  part: "",
  closing_stock_cost: 0,
  usage: 0,
  usage_cost: 0,
  system_usage: 0,
  stock_shortage: 0,
  stock_shortage_cost: 0,
});

const openEntryDialog = (data) => {
  product.value = data;
  entryDialog.value = true;
};

const submitEntry = async () => {
  const data = {
    product_id: product.value.id,
    units: product.value.unit,
    parts: entry.part.name,
    unit_price: entry.unit_price,
    purchases: entry.purchases,
    purchases_cost: entry.unit_price * entry.purchases,
    opening_stock: entry.opening_stock,
    closing_stock: entry.closing_stock,
    closing_stock_cost: entry.unit_price * entry.closing_stock,
    usage: entry.usage,
    usage_cost: entry.unit_price * entry.usage,
    system_usage: entry.system_usage,
    stock_shortage: 0,
    stock_shortage_cost: 0,
  };

  addEntry(data);
  loading.value = true;
};

const { mutate: addEntry } = useMutation(
  (data) => createNewEntry(data, userStore?.user?.token),
  {
    onSuccess: (data) => {
      if (data.status === "success") {
        entryDialog.value = false;
        loading.value = false;
        entryStore.addEntry();
        const actions = [
          {
            label: "View Entry",
            color: "white",
            handler: () => {
              router.push(`/company_entries/${data.company_slug}`);
              entryStore.clearEntry();
            },
          },
        ];
        notifyUser($q, data.message, "top-right", "blue", actions);
      }

      if (data.status === "error") {
        loading.value = false;
        errorMessage.value = data.message;
        notifyUser($q, data.message, "top-right", "red");
      }
    },

    onError: (error) => {
      notifyUser($q, `There was an error : ${error}`, "top-right", "red");
      loading.value = false;
    },
  }
);
</script>
