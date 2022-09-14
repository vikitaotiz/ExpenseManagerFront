<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else
      title="All Suppliers"
      :rows="data"
      :columns="suppliers_columns"
      row-key="name"
      separator="cell"
      v-model:pagination="pagination"
      :filter="filter"
      dense
    >
      <template v-slot:body-cell-action="props">
        <q-spinner-grid v-if="loading" class="q-mr-lg" size="30px" color="primary" />

        <q-td :props="props">
          <q-icon
            color="blue"
            name="edit"
            @click="editSupplier(props.row)"
            style="cursor: pointer"
            size="20px"
            class="q-mr-md"
          />
          <q-icon
            color="red"
            name="delete"
            @click="deleteSupplier(props.row)"
            style="cursor: pointer"
            size="20px"
          />
        </q-td>
      </template>

      <template v-slot:top-right>
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
          @click="add_new_supplier = true"
          round
          dense
          color="primary"
          size="small"
          icon="add"
        />
      </template>
    </q-table>

    <AddNewSupplierDialog
      v-model="add_new_supplier"
      @addSupplier="addSupplier"
      :supplier="supplier"
      :companies="companies"
    />
  </div>
</template>

<script>
import { useUserStore as store } from "src/stores/user-store";

export default {
  preFetch({ redirect }) {
    const userStore1 = store();
    !userStore1?.user && redirect({ path: "/" });
  },
};
</script>

<script setup>
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useMutation, useQuery, useQueryClient } from "vue-query";

import { getAll, post, update } from "src/utilities/fetchWrapper.js";
import { deleteData, notifyUser } from "src/utilities/commonMethods";
import { useUserStore } from "src/stores/user-store.js";
import { suppliers_columns } from "src/utilities/columns/suppliers_columns";
import { util_pagination } from "src/utilities/util_pagination";
import AddNewSupplierDialog from "src/components/Suppliers/AddNewSupplierDialog.vue";

const userStore = useUserStore();
const queryClient = useQueryClient();
const $q = useQuasar();

const { data, isLoading, isError, error } = useQuery("suppliers", () =>
  getAll("suppliers", userStore.user?.token)
);

const { data: companies } = useQuery("companies", () =>
  getAll("companies", userStore.user?.token)
);

const pagination = ref(util_pagination(15));

const filter = ref("");
const add_new_supplier = ref(false);
const loading = ref(false);
const selected_supplier_id = ref("");
const edit_supplier = ref(false);

const supplier = reactive({
  name: "",
  phone: "",
  address: "",
  company_id: "",

  errorMessage: "",
  form_title: "Add New Supplier",
});

const deleteSupplier = (row) => {
  const delete_product = confirm("Are you sure you want to delete " + row.name + "?");
  if (delete_product) {
    loading.value = true;
    removeSupplier(row.id);
  }
};

const { mutate: removeSupplier } = useMutation((id) => deleteData(id, "suppliers"), {
  onSuccess: (data) => {
    queryClient.refetchQueries("suppliers");
    notifyUser($q, data.message, "top-right", "orange");
    loading.value = false;
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});

const addSupplier = () => {
  add_new_supplier.value = true;
  const data = {
    name: supplier.name,
    phone: supplier.phone,
    address: supplier.address,
    company_id: supplier.company_id.id,
  };

  if (edit_supplier.value) {
    data.id = selected_supplier_id.value;
    editSelectedSupplier(data);
  } else {
    newSupplier(data);
    loading.value = true;
  }
};

const { mutate: newSupplier } = useMutation((data) => post("suppliers", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("suppliers");
      add_new_supplier.value = false;
      notifyUser($q, data.message, "top-right", "orange");
      loading.value = false;
      clearInput();
    }
    if (data.status === "error") {
      loading.value = false;
      supplier.errorMessage = data.message;
      notifyUser($q, data.message, "top-right", "red");
    }
  },
});

const editSupplier = (data) => {
  supplier.form_title = `Edit ${data.name}`;
  supplier.name = data.name;
  supplier.phone = data.phone;
  supplier.address = data.address;
  supplier.company_id = data.company_id;

  selected_supplier_id.value = data.id;
  add_new_supplier.value = true;
  edit_supplier.value = true;
};

const { mutate: editSelectedSupplier } = useMutation(
  (data) => update(`suppliers/${data.id}`, data),
  {
    onSuccess: (data) => {
      if (data.status === "success") {
        queryClient.refetchQueries("suppliers");
        add_new_supplier.value = false;
        notifyUser($q, data.message, "top-right", "orange");
        loading.value = false;
        clearInput();
      }
      if (data.status === "error") {
        loading.value = false;
        supplier.errorMessage = data.message;
        notifyUser($q, data.message, "top-right", "red");
      }
    },
  }
);

const clearInput = () => {
  supplier.name = "";
  supplier.phone = "";
  supplier.address = "";
  supplier.company_id = "";

  supplier.errorMessage = "";

  selected_supplier_id.value = "";
  add_new_supplier.value = false;
  edit_supplier.value = false;
};
</script>
