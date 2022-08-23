<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else
      title="Company Stores"
      :rows="stores"
      :columns="company_store_columns"
      :grid="$q.screen.xs"
      row-key="name"
      separator="cell"
      v-model:pagination="pagination"
      :filter="filter"
      dense
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
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          @click="new_store_dialog = true"
          round
          dense
          color="primary"
          size="small"
          icon="add"
        />
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props" v-if="!props.row.product_count">
          <q-icon
            color="red"
            name="delete"
            @click="deleteStore(props.row)"
            style="cursor: pointer"
            size="20px"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="new_store_dialog" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section> <div class="text-h6">Add New Store</div> </q-card-section
        ><q-separator class="q-mb-sm" />

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col q-pa-sm">
              <q-input
                dense
                outlined
                v-model="name"
                label="Store name..."
                type="text"
                class="q-mb-md"
                autofocus
              />
            </div>
            <div class="col q-pa-sm">
              <q-select
                dense
                outlined
                v-model="company"
                :options="companies"
                option-label="name"
                label="Company"
                v-if="name"
              />
            </div>
          </div>
          <q-input
            class="q-ma-sm"
            v-model="description"
            outlined
            type="textarea"
            label="Store description (optional)..."
            v-if="company"
          />

          <small style="color: red">{{ errorMessage }}</small>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-space />
          <q-btn v-if="company" @click="addStore" flat label="Add" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useQuery, useMutation, useQueryClient } from "vue-query";

import { company_store_columns } from "src/utilities/columns/CompanyStoreColumns";
import { fetchData, deleteData, notifyUser } from "src/utilities/commonMethods";
import { post } from "src/utilities/fetchWrapper";
import { util_pagination } from "src/utilities/util_pagination";

const queryClient = useQueryClient();
const $q = useQuasar();

const { data: stores, isLoading, isError, error } = useQuery("stores", () =>
  fetchData("stores")
);

const { data: companies } = useQuery("companies", () => fetchData("companies"));

const pagination = ref(util_pagination(15));

const new_store_dialog = ref(false);
const name = ref("");
const description = ref("");
const company = ref("");
const filter = ref("");
const loading = ref(false);
const errorMessage = ref("");

const addStore = () => {
  let data = {
    name: name.value,
    company_id: company.value.id,
    description: description.value,
  };
  addNewStore(data);
  loading.value = true;
};

const { mutate: addNewStore } = useMutation((data) => post("stores", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("stores");
      loading.value = false;
      notifyUser($q, data.message, "top-right", "orange");
      clearInput();
    }
    if (data.status === "error") {
      notifyUser($q, data.message, "top-right", "red");
      errorMessage.value = data.message;
      loading.value = false;
    }
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
    clearInput();
  },
});

const deleteStore = (row) => {
  const delete_product = confirm("Are you sure?");
  if (delete_product) {
    loading.value = true;
    removeStore(row.id);
  }
};

const { mutate: removeStore } = useMutation((id) => deleteData(id, "stores"), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("stores");
      notifyUser($q, data.message, "top-right", "orange");
      loading.value = false;
    }
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});

const clearInput = () => {
  name.value = "";
  description.value = "";
  company.value = "";
  errorMessage.value = "";
};
</script>
