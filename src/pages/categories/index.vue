<template>
  <div class="q-pa-md">
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

    <NewCategoryDialog
      v-model="new_category_dialog"
      :category="category"
      @addCategory="addCategory"
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
import { useQuasar } from "quasar";
import { useQuery, useMutation, useQueryClient } from "vue-query";

import { fetchData, notifyUser } from "src/utilities/commonMethods";
import { post } from "src/utilities/fetchWrapper";
import { util_pagination } from "src/utilities/util_pagination";
import NewCategoryDialog from "src/components/Categories/NewCategoryDialog.vue";

const $q = useQuasar();
const queryClient = useQueryClient();

const pagination = ref(util_pagination(10));

const filter = ref("");
const category = reactive({
  title: "",
  description: "",
});

const new_category_dialog = ref(false);
const loading = ref(false);

const { data: categories, isLoading, isError } = useQuery("categories", () =>
  fetchData("categories")
);

const openCategoryDialog = () => (new_category_dialog.value = true);

const addCategory = async () => {
  let data = {
    title: category.title.trim(),
    description: category.description,
  };

  if (data.title) addNewCategory(data);
  loading.value = true;
};

const { mutate: addNewCategory } = useMutation((data) => post("categories", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("categories");
      new_category_dialog.value = false;
      notifyUser($q, data.message, "top-right", "orange");
      loading.value = false;
      clearInput();
    }

    if (data.status === "error") {
      loading.value = false;
      notifyUser($q, data.message, "top-right", "red");
    }
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});

const clearInput = () => {
  category.title = "";
  category.description = "";
};
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
