<template>
  <div class="q-pa-md">
    <q-card dark bordered class="bg-primary q-pa-sm q-mb-md">
      <div class="row">
        <div class="col-xs-12 col-sm-3 col-md-3">
          <q-btn
            @click="$router.back()"
            color="white"
            dense
            flat
            icon="arrow_back"
            label="Back "
          />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3 q-pt-sm">
          <q-spinner-grid v-if="loading" class="q-mr-lg" size="20px" />
          <b>{{ category?.data?.title?.toUpperCase() }} </b>
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3">
          <q-input
            v-if="category?.data?.products.length > 0"
            dense
            outlined
            rounded
            debounce="300"
            v-model="filter"
            placeholder="Search products..."
            class="q-mr-md"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3 top-right">
          <q-btn
            @click="new_product_dialog = true"
            round
            color="orange"
            size="small"
            icon="add"
            unelevated
          />
          <q-icon
            v-if="category?.data?.products.length < 1"
            @click="removeCategory"
            class="q-ml-md"
            color="white"
            size="sm"
            name="delete"
            style="cursor: pointer"
            unelevated
          />
        </div>
      </div>
    </q-card>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred</div>
    <q-table
      v-else
      :rows="category?.data?.products"
      :columns="category_product_columns"
      :grid="$q.screen.xs"
      row-key="name"
      separator="cell"
      v-model:pagination="pagination"
      dense
      :filter="filter"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-icon
            color="red"
            name="delete"
            @click="deleteProduct(props.row)"
            style="cursor: pointer"
            size="20px"
          />
        </q-td>
      </template>
    </q-table>

    <NewCategoryProductDialog
      v-model="new_product_dialog"
      :product="product"
      :parts="parts"
      :stores="stores"
      :ingredients="ingredients"
      @addProduct="addProduct"
      :errorMessage="errorMessage"
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
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "vue-query";

import { getSingle, post } from "src/utilities/fetchWrapper.js";
import { fetchData, deleteData, notifyUser } from "src/utilities/commonMethods";
import { storageId } from "src/utilities/constants";
import { category_product_columns } from "src/utilities/columns/category_product_columns";
import { util_pagination } from "src/utilities/util_pagination";
import NewCategoryProductDialog from "src/components/Categories/NewCategoryProductDialog.vue";

const route = useRoute();
const filter = ref("");
const router = useRouter();
const $q = useQuasar();
const queryClient = useQueryClient();

const new_product_dialog = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const product = reactive({
  name: "",
  description: "",
  unit_id: "",
  store_id: "",
  category_id: "",
  ingredient_content: [],
});

const { isLoading, isError, data: category, error } = useQuery(
  ["categories", route.params.slug],
  () => getSingle("categories", route.params.slug),
  {
    onSuccess: (data) => (product.category_id = data.data.id),
  }
);

const { data: parts } = useQuery("parts", () => fetchData("parts"));
const { data: stores } = useQuery("stores", () => fetchData("stores"));
const { data: ingredients } = useQuery("ingredients", () => fetchData("ingredients"));

const pagination = ref(util_pagination(10));

const removeCategory = () => {
  if (route.params.slug) {
    const delete_category = confirm("Are you sure?");
    if (delete_category) deleteCategory(route.params.slug);
  }
};

const { mutate: deleteCategory } = useMutation((slug) => deleteData(slug, "categories"), {
  onSuccess: (data) => {
    router.push("/categories");
    notifyUser($q, data.message, "top-right", "orange");
  },

  onError: (error) => notifyUser($q, `There was an error: ${error}`, "top-right", "red"),
});

const addProduct = () => {
  product.ingredient_content = [];
  let auth = JSON.parse(localStorage.getItem(storageId));
  let data = {
    name: product.name,
    description: product.description,
    category_id: product.category_id,
    company_id: auth.user?.company_id,
    ingredient_content: JSON.parse(JSON.stringify(product.ingredient_content)),
  };

  addNewProduct(data);
  loading.value = true;
};

const { mutate: addNewProduct } = useMutation((data) => post("products", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries(["categories", route.params.slug]);
      new_product_dialog.value = false;
      loading.value = false;
      clearInput();
      notifyUser($q, data.message, "top-right", "orange");
    }

    if (data.status === "error") {
      loading.value = false;
      errorMessage.value = data.message;
      notifyUser($q, data.message, "top-right", "red");
    }
  },

  onError: (error) => {
    new_product_dialog.value = false;
    loading.value = false;
    clearInput();
    notifyUser($q, `There was an error: ${error}`, "top-right", "red");
  },
});

const deleteProduct = (row) => {
  const delete_product = confirm("Are you sure?");
  if (delete_product) {
    loading.value = true;
    removeProduct(row.id);
  }
};

const { mutate: removeProduct } = useMutation((id) => deleteData(id, "products"), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries(["categories", route.params.slug]);
      loading.value = false;
      notifyUser($q, data.message, "top-right", "orange");
    }
    if (data.status === "error") {
      loading.value = false;
      notifyUser($q, data.message, "top-right", "red");
    }
  },

  onError: (error) => {
    loading.value = false;
    notifyUser($q, `There was an error: ${error}`, "top-right", "red");
  },
});

const clearInput = () => {
  product.name = "";
  product.description = "";
  product.unit_id = "";
  product.store_id = "";
};

// const resetForm = () => clearInput();
</script>
