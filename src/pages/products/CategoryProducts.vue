<template>
  <div class="q-pa-md">
    <q-card dark bordered class="bg-primary q-pa-sm q-mb-md">
      <div class="row">
        <div class="col">
          <q-btn
            @click="$router.back()"
            color="white"
            dense
            flat
            icon="arrow_back"
            label="Back "
          />
        </div>
        <div class="col q-pt-sm">
          <q-spinner-grid v-if="loading" class="q-mr-lg" size="20px" />
          <b>{{ category?.data?.title?.toUpperCase() }} </b>
        </div>
        <div class="col">
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
        <div class="col top-right">
          <q-btn
            @click="new_product_dialog = true"
            round
            color="orange"
            size="small"
            icon="add"
          />
          <q-btn
            v-if="category?.data?.products.length < 1"
            @click="removeCategory"
            class="q-ml-md"
            color="red"
            size="small"
            icon="delete"
          />
        </div>
      </div>
    </q-card>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred</div>
    <q-table
      v-else
      :rows="category?.data?.products"
      :columns="columns"
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

    <q-dialog v-model="new_product_dialog" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section> <div class="text-h6">Add New Product</div> </q-card-section
        ><q-separator class="q-mb-sm" />

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col">
              <q-input
                dense
                outlined
                v-model="product.name"
                label="Product name..."
                type="text"
                class="q-ma-sm"
              />
            </div>
            <div class="col">
              <q-select
                clearable
                :options="units"
                option-label="title"
                outlined
                v-model="product.unit_id"
                label="Measurement Unit"
                dense
                class="q-ma-sm"
              />
            </div>
          </div>

          <q-input
            v-model="product.description"
            outlined
            type="textarea"
            label="Product description (optional)..."
            class="q-ma-sm"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-space />
          <q-btn
            v-if="product.name && product.unit_id"
            @click="addProduct"
            flat
            label="Add"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "vue-query";
import { getSingle, post } from "src/utilities/fetchWrapper.js";
import { fetchData, deleteData } from "src/utilities/commonMethods";
import { storageId } from "src/utilities/constants";
import { useUserStore } from "src/stores/user-store";

const route = useRoute();
const filter = ref("");
const router = useRouter();
const $q = useQuasar();
const queryClient = useQueryClient();
const userStore = useUserStore();

const new_product_dialog = ref(false);
const loading = ref(false);

const product = reactive({
  name: "",
  description: "",
  unit_id: "",
});

const { isLoading, isError, data: category, error } = useQuery(
  ["categories", route.params.slug],
  () => getSingle("categories", route.params.slug)
);

const { data: units } = useQuery("units", () => fetchData("units"));

const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "description",
    align: "center",
    label: "Description",
    field: "description",
    sortable: true,
  },
  { name: "unit", label: "Unit", field: "unit", sortable: true },
  { name: "company", label: "Company", field: "company", sortable: true },
  { name: "created_at", label: "Time", field: "created_at", sortable: true },
  { name: "action", label: "Action", align: "center" },
];

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

const removeCategory = () => {
  if (route.params.slug) {
    const delete_category = confirm("Are you sure?");
    if (delete_category) deleteCategory(route.params.slug);
  }
};

const { mutate: deleteCategory } = useMutation(
  (slug) => deleteData(slug, "categories", userStore?.user?.token),
  {
    onSuccess: () => {
      router.push("/categories");
      $q.notify({
        message: "Category deleted successfully.",
        color: "orange",
        position: "top-right",
      });
    },

    onError: (error) => alert("There was an error!"),
  }
);

const addProduct = () => {
  let auth = JSON.parse(localStorage.getItem(storageId));
  let data = {
    name: product.name,
    description: product.description,
    slug: route.params?.slug,
    unit_id: product.unit_id?.id,
    company_id: auth.user?.company_id,
  };

  addNewProduct(data);
  loading.value = true;
};

const { mutate: addNewProduct } = useMutation((data) => post("products", data), {
  onSuccess: (data) => {
    queryClient.refetchQueries(["categories", route.params.slug]);
    $q.notify({
      message: "Product created successfully.",
      color: "orange",
      position: "top-right",
    });
    new_product_dialog.value = false;
    loading.value = false;
    clearInput();
  },

  onError: (error) => alert("There was an error, reload the page!"),
});

const deleteProduct = (row) => {
  const delete_product = confirm("Are you sure?");
  if (delete_product) {
    loading.value = true;
    removProduct(row.id);
  }
};

const { mutate: removProduct } = useMutation((id) => deleteData(id, "products"), {
  onSuccess: (data) => {
    queryClient.refetchQueries(["categories", route.params.slug]);
    $q.notify({
      message: "Product deleted successfully.",
      color: "orange",
      position: "top-right",
    });
    loading.value = false;
  },
});

const clearInput = () => {
  product.name = "";
  product.description = "";
  product.unit_id = "";
};
</script>
