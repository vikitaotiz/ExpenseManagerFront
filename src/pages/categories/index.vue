<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred</div>

    <q-table
      v-else
      grid
      title="Categories"
      :rows="categories"
      row-key="title"
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
        <q-btn
          @click="openCategoryDialog"
          round
          dense
          color="primary"
          size="small"
          icon="add"
        />
      </template>

      <q-separator />

      <template v-slot:item="props">
        <router-link
          :to="`/category_products/${props.row.slug}`"
          class="q-pa-xs col-xs-12 col-sm-6 col-md-3"
          style="text-decoration: none"
        >
          <q-card style="cursor: pointer" class="mycard">
            <q-card-section class="text-center">
              <b>{{ props.row.title.toUpperCase() }}</b>
            </q-card-section>
            <q-separator color="orange" />
            <q-card-section>
              <small><b>Products </b>: {{ props.row.products }}</small> <q-space />
              <small><b>Created on </b>: {{ props.row.created_at }}</small>
            </q-card-section>
          </q-card>
        </router-link>
      </template>
    </q-table>

    <q-dialog v-model="new_category_dialog" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section> <div class="text-h6">Add New Category</div> </q-card-section
        ><q-separator class="q-mb-sm" />

        <q-card-section class="q-pt-none">
          <q-input
            dense
            outlined
            v-model="title"
            label="Category name..."
            type="text"
            class="q-mb-md"
          />
          <q-input
            v-model="description"
            outlined
            type="textarea"
            label="Category description (optional)..."
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-space />
          <q-btn @click="addCategory" flat label="Add" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useQuery, useMutation, useQueryClient } from "vue-query";
import { fetchData } from "src/utilities/commonMethods";
import { post } from "src/utilities/fetchWrapper";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();

const $q = useQuasar();
const queryClient = useQueryClient();

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

const filter = ref("");
const title = ref("");
const description = ref("");
const new_category_dialog = ref(false);
const loading = ref(false);

const { data: categories, isLoading, isError } = useQuery("categories", () =>
  fetchData("categories", userStore?.user?.token)
);

const openCategoryDialog = () => (new_category_dialog.value = true);

const addCategory = async () => {
  let data = {
    title: title.value,
    description: description.value,
  };

  if (data.title) addNewCategory(data);
  loading.value = true;
};

const { mutate: addNewCategory } = useMutation((data) => post("categories", data), {
  onSuccess: (data) => {
    queryClient.refetchQueries("categories");
    new_category_dialog.value = false;
    loading.value = false;
    $q.notify({
      message: "Category created successfully.",
      color: "orange",
      position: "top-right",
    });
  },

  onError: (error) => {
    alert("Something went wrong.");
    loading.value = false;
  },
});
</script>

<style>
.mycard {
  text-decoration: none;
  color: #029e43;
}

.mycard:hover {
  background: #029e43;
  color: white;
}
</style>
