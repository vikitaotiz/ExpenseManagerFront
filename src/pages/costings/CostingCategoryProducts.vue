<template>
  <div class="q-pa-md">
    <q-card class="bg-orange text-white">
      <q-card-actions>
        <q-btn
          @click="$router.back()"
          color="white"
          dense
          flat
          icon="arrow_back"
          label="Back"
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
    <small v-if="category?.data?.products?.length < 1">
      <q-btn
        flat
        class="q-ma-sm"
        size="sm"
        label="Add Products To This Category"
        color="primary"
        :to="`/category_products/${category?.data?.slug}`"
      />
    </small>
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
        >
          <q-card
            style="cursor: pointer; border-radius: 10px"
            clickable
            @click="openEntryDialog(props.row)"
            class="product"
          >
            <q-list separator dense>
              <q-item>
                <q-item-section class="text-center">
                  <b>{{ props.row.name.toUpperCase() }}</b></q-item-section
                >
              </q-item>
              <!-- <q-expansion-item
                  class="full width"
                  dense
                  icon="explore"
                  :label="`Raw Materials ${props.row?.raw_materials?.length}`"
                >
                  <q-card> 
                    <q-card-section>
                      <span v-if="props.row?.raw_materials?.length < 1"
                        >No Raw Materials</span
                      >
                      <table v-else style="width: 100%; border-collapse: collapse">
                        <thead>
                          <th style="border: 1px solid #dddddd; text-align: left">
                            Name
                          </th>
                          <th style="border: 1px solid #dddddd; text-align: left">
                            Processing Unit
                          </th>
                        </thead>
                        <tbody>
                          <tr v-for="mat in props.row.raw_materials" :key="mat.id">
                            <td style="border: 1px solid #dddddd; text-align: left">
                              {{ mat.name }}
                            </td>
                            <td style="border: 1px solid #dddddd; text-align: left">
                              {{ mat.processing_unit }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </q-card-section>
                  </q-card>
                </q-expansion-item> -->
            </q-list>
            <q-separator />

            <q-card-actions>
              <span> Selling Price </span><q-space /> Ksh
              {{ props.row.selling_price }}</q-card-actions
            >
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
      :todayOpeningStockLoading="todayOpeningStockLoading"
      :todayOpeningStockError="todayOpeningStockError"
      :lockOpeningStock="lockOpeningStock"
      @closeDialog="closeDialog"
    />
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
import { reactive, ref } from "vue";
import { useQuery, useMutation } from "vue-query";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";

import { useUserStore } from "src/stores/user-store";
import { getSingle, post } from "src/utilities/fetchWrapper";
import { useEntryStore } from "src/stores/entry-store";
import { createNewEntry, fetchData, notifyUser } from "src/utilities/commonMethods";
import { util_pagination } from "src/utilities/util_pagination";
import NewEntryDialog from "src/components/EntryCostings/NewEntryDialog.vue";

const route = useRoute();
const router = useRouter();
const filter = ref("");
const errorMessage = ref("");
const loading = ref(false);
const entryDialog = ref(false);
let lockOpeningStock = ref(false);
const product = ref("");
const $q = useQuasar();
const entryStore = useEntryStore();

const pagination = ref(util_pagination(10));

const { data: category, isLoading, isError } = useQuery(
  ["categories", route.params.slug],
  () => getSingle("categories", route.params.slug)
);

const { data: parts } = useQuery("parts", () => fetchData("parts"));

let entry = reactive({
  unit_price: 0,
  selling_price: 0,
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
  ingredient_content: [],
});

const openEntryDialog = (data) => {
  product.value = data;
  entryDialog.value = true;
  todayOpeningStock(data.id);
};

const {
  mutate: todayOpeningStock,
  isLoading: todayOpeningStockLoading,
  isError: todayOpeningStockError,
} = useMutation((id) => post("product_closing_stock", { product_id: id }), {
  onSuccess: (data) => {
    if (data.status === "success") {
      lockOpeningStock.value = true;
      entry.opening_stock = data.today_opening_stock;
    }
    if (data.status === "error") entry.opening_stock = 0;
  },
});

const submitEntry = async () => {
  const data = {
    product_id: product.value.id,
    units: product.value.unit,
    parts: entry.part.name,
    // unit_price: parseFloat(entry.unit_price),
    unit_price: 0,
    selling_price: product.value.selling_price,
    purchases: parseInt(entry.purchases),
    purchases_cost: entry.unit_price * entry.purchases,
    opening_stock: parseInt(entry.opening_stock),
    closing_stock: parseInt(entry.closing_stock),
    closing_stock_cost: entry.unit_price * entry.closing_stock,
    usage: entry.usage,
    usage_cost: entry.unit_price * entry.usage,
    system_usage: parseInt(entry.system_usage),
    stock_shortage: 0,
    stock_shortage_cost: 0,
  };

  addEntry(data);

  loading.value = true;
};

const userStore = useUserStore();

const { mutate: addEntry } = useMutation(
  (data) => createNewEntry(data, userStore.user.user),
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

const closeDialog = () => {
  lockOpeningStock.value = false;
  errorMessage.value = "";
  entry.unit_price = 0;
  entry.selling_price = 0;
  entry.purchases = 0;
  entry.opening_stock = 0;
  entry.closing_stock = 0;
  entry.part = "";
  entry.closing_stock_cost = 0;
  entry.usage = 0;
  entry.usage_cost = 0;
  entry.system_usage = 0;
  entry.stock_shortage = 0;
  entry.stock_shortage_cost = 0;
};
</script>

<style scoped>
.product:hover {
  color: orange;
  border: 1px solid orange;
}
</style>
