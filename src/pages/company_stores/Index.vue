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

    <NewCompanyStoreDialog
      @addStore="addStore"
      v-model="new_store_dialog"
      :company_store="company_store"
      :companies="companies"
    />
  </div>
</template>

<script>
import { useUserStore as store } from "src/stores/user-store";
export default {
  preFetch({ currentRoute, previousRoute, redirect }) {
    const userStore1 = store();
    !userStore1?.user && redirect({ path: "/" });
  },
};
</script>

<script setup>
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useQuery, useMutation, useQueryClient } from "vue-query";

import { company_store_columns } from "src/utilities/columns/CompanyStoreColumns";
import { fetchData, deleteData, notifyUser } from "src/utilities/commonMethods";
import { post } from "src/utilities/fetchWrapper";
import { util_pagination } from "src/utilities/util_pagination";
import NewCompanyStoreDialog from "src/components/Companies/NewCompanyStoreDialog.vue";

const queryClient = useQueryClient();
const $q = useQuasar();

const { data: stores, isLoading, isError, error } = useQuery("stores", () =>
  fetchData("stores")
);

const { data: companies } = useQuery("companies", () => fetchData("companies"));

const pagination = ref(util_pagination(15));

const new_store_dialog = ref(false);

const company_store = reactive({
  name: "",
  description: "",
  company: "",
  errorMessage: "",
});

const filter = ref("");
const loading = ref(false);

const addStore = () => {
  let data = {
    name: company_store.name,
    company_id: company_store.company.id,
    description: company_store.description,
  };

  addNewStore(data);
  loading.value = true;
};

const { mutate: addNewStore } = useMutation((data) => post("stores", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("stores");
      loading.value = false;
      new_store_dialog.value = false;
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
