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

    <q-dialog v-model="entryDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-actions>
          <div class="text-h6" text-color="primary">
            {{ product.name.toUpperCase() }}
          </div>
          <q-space />
          <span>Units : {{ product.unit }}</span>
        </q-card-actions>
        <q-separator />

        <q-card-section class="q-pt-none">
          <small
            >Description :
            {{
              product.description ? product.description : "No product description."
            }}</small
          >
          <q-separator />
          <div class="row">
            <div class="col-xs-12 col-sm-3 col-md-3">
              <q-input
                type="number"
                outlined
                v-model="entry.unit_price"
                label="Unit Price"
                dense
                class="q-ma-md"
              />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3">
              <q-input
                v-if="entry.unit_price"
                type="number"
                outlined
                v-model="entry.opening_stock"
                label="Opening Stock"
                dense
                class="q-ma-md"
              />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3">
              <q-input
                v-if="entry.opening_stock"
                type="number"
                outlined
                v-model="entry.closing_stock"
                label="Closing Stock"
                dense
                class="q-ma-md"
              />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3">
              <q-input
                v-if="entry.closing_stock"
                type="number"
                outlined
                v-model="entry.purchases"
                label="Purchases"
                dense
                class="q-ma-md"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-4 col-md-4">
              <q-input
                v-if="entry.purchases"
                type="number"
                outlined
                v-model="entry.usage"
                label="Usage"
                dense
                class="q-ma-md"
              />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4">
              <q-input
                v-if="entry.usage"
                type="number"
                outlined
                v-model="entry.system_usage"
                label="Sytem usage"
                dense
                class="q-ma-md"
              />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4">
              <q-select
                v-if="entry.system_usage"
                clearable
                :options="parts"
                option-label="name"
                option-value="name"
                outlined
                v-model="entry.part"
                label="Measurements"
                dense
                class="q-ma-md"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="red" v-close-popup /><q-space />
          <q-btn
            v-if="entry.part"
            flat
            label="Submit Entry"
            color="primary"
            @click="submitEntry()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useQuery, useMutation } from "vue-query";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { getSingle } from "src/utilities/fetchWrapper";
import { useEntryStore } from "src/stores/entry-store";
import { createNewEntry, fetchData } from "src/utilities/commonMethods";
import { useUserStore } from "src/stores/user-store";

const route = useRoute();
const filter = ref("");
const loading = ref(false);
const entryDialog = ref(false);
const product = ref("");
const $q = useQuasar();
const entryStore = useEntryStore();
const userStore = useUserStore();

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

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
      entryDialog.value = false;
      loading.value = false;
      entryStore.addEntry();
      $q.notify({
        message: "Entry created successfully.",
        color: "orange",
        position: "top-right",
      });
    },

    onError: (error) => {
      alert("There was an error : " + error);
      entryDialog.value = false;
    },
  }
);
</script>
