<template>
  <div class="q-pa-sm">
    <div class="myTitle">
      <p>Create Entries <q-spinner-grid v-if="loading" size="30px" color="primary" /></p>
    </div>
    <q-separator color="primary" class="q-mb-md" />
    <div class="row">
      <div class="q-pa-xs col-xs-12 col-sm-7 col-md-8">
        <q-card class="q-pa-xs myborder">
          <q-tabs
            v-model="tab"
            active-color="yellow"
            indicator-color="orange"
            align="justify"
            narrow-indicator
            class="bg-primary text-white q-mb-sm"
          >
            <div v-for="category in categories" :key="category.slug">
              <q-tab
                :name="category.title"
                :label="category.title"
                @click="selectCategory(category)"
              >
                <q-badge v-if="category.products > 0" color="red" floating>{{
                  category.products
                }}</q-badge>
              </q-tab>
            </div>
          </q-tabs>

          <div v-if="!category" class="select_product q-pa-md" style="height: 300px">
            <div class="text-h6">Select Product Category To Begin...</div>
          </div>
          <div v-else>
            <div class="row q-px-sm">
              <div class="col-4">
                <div class="text-h6">{{ category?.title?.toUpperCase() }}</div>
              </div>
              <div v-if="category.products > 0" class="col-8">
                <q-input
                  clearable
                  filled
                  v-model="search_products"
                  label="Search Products in this category..."
                  dense
                  class="q-mb-md"
                />
              </div>
            </div>
            <q-separator color="primary" />

            <q-card flat class="q-pa-sm">
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-btn
                  v-if="resultQuery?.length > 0"
                  v-for="product in resultQuery"
                  :key="product.id"
                  icon="check"
                  color="primary"
                  size="sm"
                  unelevated
                  class="q-ma-sm"
                  @click="openEntryDialog(product)"
                  ><b class="q-ma-xs">{{ product.name }}</b></q-btn
                >

                <div v-else>
                  This category has no products...
                  <br /><br />
                  <q-btn
                    flat
                    color="primary"
                    :to="`/category_products/${category.slug}`"
                    label="Add products to this category"
                    size="sm"
                  />
                </div>
              </div>
            </q-card>
          </div>
        </q-card>
      </div>
      <div class="q-pa-xs col-xs-12 col-sm-5 col-md-4">
        <q-card class="q-pa-sm myborder">
          <q-card-section>
            <div class="text-h6">
              Today's Entries. {{ entries?.length }}
            </div> </q-card-section
          ><q-separator color="primary" />
          <q-table dense :rows="entries" :columns="columns" row-key="product">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="product" :props="props">
                  {{ props.row.product }}
                </q-td>
                <q-td key="parts" :props="props">
                  {{ props.row.parts }}
                </q-td>
                <q-td key="units" :props="props">
                  {{ props.row.units }}
                </q-td>

                <q-td key="action" :props="props">
                  <q-icon
                    color="red"
                    name="delete"
                    @click="deleteTodayEntry(props.row)"
                    style="cursor: pointer"
                    size="20px"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>

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
          <q-btn flat label="Submit Entry" color="primary" @click="submitEntry()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useQuasar } from "quasar";
import { useQuery, useMutation, useQueryClient } from "vue-query";
import {
  fetchData,
  createNewEntry,
  filterCategoryProducts,
  deleteData,
} from "src/utilities/commonMethods";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();
const queryClient = useQueryClient();
const $q = useQuasar();

const columns = [
  {
    name: "product",
    required: true,
    label: "Product",
    align: "left",
    field: (row) => row.product,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "parts",
    align: "center",
    label: "Measurement",
    field: "parts",
    sortable: true,
  },
  { name: "units", label: "Unit", field: "units", sortable: true },
  { name: "action", label: "Action" },
];

const search_products = ref("");
const entryDialog = ref(false);
const loading = ref(false);
const product = ref("");
const category_products = ref([]);
const category = ref("");

const tab = ref("");

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

const { data: categories } = useQuery("categories", () =>
  fetchData("categories", userStore?.user?.token)
);
const { data: parts } = useQuery("parts", () =>
  fetchData("parts", userStore?.user?.token)
);
const { data: entries } = useQuery("today_entries", () =>
  fetchData("today_entries", userStore?.user?.token)
);

const openEntryDialog = (data) => {
  product.value = data;
  entryDialog.value = true;
};

const resultQuery = computed(() =>
  filterCategoryProducts(search_products.value, category_products.value)
);

const selectCategory = (data) => {
  category_products.value = data.products_data;
  category.value = data;
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
      queryClient.refetchQueries("today_entries");
      entryDialog.value = false;
      loading.value = false;
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

const { mutate: removeEntry } = useMutation(
  (id) => deleteData(id, "entries", userStore?.user?.token),
  {
    onSuccess: (data) => {
      queryClient.refetchQueries("today_entries");
      loading.value = false;
      $q.notify({
        message: "Entry deleted successfully.",
        color: "orange",
        position: "top-right",
      });
    },

    onError: (error) => {
      alert("There was an error : " + error);
      loading.value = false;
    },
  }
);

const deleteTodayEntry = (row) => {
  const delete_entry = confirm("Are you sure?");
  if (delete_entry) {
    loading.value = true;
    removeEntry(row.id);
  }
};
</script>

<style>
.myborder {
  border: 1px solid #029e43;
}

.select_product {
  display: flex;
  margin: auto;
  color: #83aa93;
  align-items: center;
  justify-content: center;
}

.myTitle {
  text-align: center;
  font-weight: bolder;
  color: #029e43;
  font-size: 3em;
}
</style>
