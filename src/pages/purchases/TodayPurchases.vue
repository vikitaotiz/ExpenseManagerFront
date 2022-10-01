<template>
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-md-6">
      <CommonHeader :section_title="`Today Purchases : Ksh ${computedTodayTotal}`" />
    </div>
    <div class="col-xs-12 col-sm-6 col-md-6">
      <q-card class="q-ma-md">
        <div v-if="loadingPayments">Loading payment modes</div>
        <div v-else-if="paymentsError">An error has occurred</div>
        <q-btn
          v-else
          @click="filterDataWithPaymentMode(mode)"
          unelevated
          dense
          v-for="mode in payment_modes"
          :label="mode.name"
          :key="mode.id"
          class="q-ma-sm"
          color="orange"
        />
      </q-card>
    </div>
  </div>

  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else
      title="Today Purchases"
      :rows="purchases_data"
      :columns="purchases_columns"
      row-key="name"
      separator="cell"
      v-model:pagination="pagination"
      :filter="filter"
      dense
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-icon
            color="blue"
            name="edit"
            @click="editPurchase(props.row)"
            style="cursor: pointer"
            size="20px"
            class="q-mr-md"
          />
          <q-icon
            color="red"
            name="delete"
            @click="deletePurchase(props.row)"
            style="cursor: pointer"
            size="20px"
          />
        </q-td>
      </template>

      <template v-slot:top-right>
        <q-spinner-grid v-if="loading" class="q-mr-lg" size="20px" />
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
          @click="add_new_purchase = true"
          round
          dense
          color="primary"
          size="small"
          icon="add"
        />
      </template>

      <template v-slot:top-left>
        <q-btn
          v-if="reset"
          dense
          flat
          color="orange"
          icon="autorenew"
          label="Reset"
          @click="resetPurchases()"
        />
      </template>
    </q-table>

    <AddNewPurchaseDialog
      v-model="add_new_purchase"
      @addPurchase="addPurchase"
      :purchase="purchase"
      :ingredients="ingredients"
      :units="units"
      :suppliers="suppliers"
      :payment_modes="payment_modes"
      @resetForm="resetForm"
      :edit_purchase="edit_purchase"
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
import { computed, reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useMutation, useQuery, useQueryClient } from "vue-query";

import { getAll, post, update } from "src/utilities/fetchWrapper.js";
import { deleteData, notifyUser } from "src/utilities/commonMethods";
import { useUserStore } from "src/stores/user-store.js";
import { purchases_columns } from "src/utilities/columns/purchases_columns";
import { util_pagination } from "src/utilities/util_pagination";
import AddNewPurchaseDialog from "src/components/Purchases/AddNewPurchaseDialog.vue";
import CommonHeader from "src/components/CommonHeader.vue";

const userStore = useUserStore();
const queryClient = useQueryClient();
const $q = useQuasar();

const purchases_data = ref([]);
const purchases_data_copy = ref([]);
const reset = ref(false);

const { isLoading, isError, error } = useQuery(
  "today_purchases",
  () => getAll("today_purchases", userStore.user?.token),
  {
    onSuccess: (data) => {
      purchases_data.value = data;
      purchases_data_copy.value = data;
    },
  }
);

const computedTodayTotal = computed(() =>
  purchases_data.value.reduce((a, b) => a + Number(b.total_amount), 0)
);

const { data: ingredients } = useQuery("ingredients", () =>
  getAll("ingredients", userStore.user?.token)
);

const { data: units } = useQuery("units", () => getAll("units", userStore.user?.token));
const { data: suppliers } = useQuery("suppliers", () =>
  getAll("suppliers", userStore.user?.token)
);

const payment_modes = ref([]);
const { isLoading: loadingPayments, isError: paymentsError } = useQuery(
  "payment_modes",
  () => getAll("payment_modes", userStore.user?.token),
  {
    onSuccess: (data) => (payment_modes.value = data),
  }
);

const pagination = ref(util_pagination(15));

const filter = ref("");
const add_new_purchase = ref(false);
const loading = ref(false);
const selected_purchase = ref("");
const edit_purchase = ref(false);

const purchase = reactive({
  product: "",
  quantity: 0,
  issued: 0,
  opening_stock: 0,
  closing_stock: 0,
  measurement: "",
  total_amount: 0,
  unit_price: 0,
  balance: 0,
  user_id: "",
  company_id: "",
  payment_mode_id: "",
  supplier_id: "",
  actual_stock: 0,

  errorMessage: "",
  form_title: "Add New Purchase",
});

const deletePurchase = (row) => {
  const delete_product = confirm("Are you sure you want to delete " + row.name + "?");
  if (delete_product) {
    loading.value = true;
    removePurchase(row.id);
  }
};

const { mutate: removePurchase } = useMutation((id) => deleteData(id, "purchases"), {
  onSuccess: (data) => {
    queryClient.refetchQueries("today_purchases");
    notifyUser($q, data.message, "top-right", "orange");
    loading.value = false;
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});

const addPurchase = () => {
  add_new_purchase.value = true;
  if (!purchase.product) {
    alert("Product is required");
    return false;
  }

  let data = {
    product: purchase.product?.name,
    quantity: purchase.quantity,
    issued: purchase.issued,
    opening_stock: purchase.opening_stock,
    closing_stock: purchase.closing_stock,
    measurement: purchase.measurement?.title,
    total_amount: purchase.total_amount,
    unit_price: purchase.unit_price,
    payment_mode_id: purchase.payment_mode_id.id,
    supplier_id: purchase.supplier_id.id,
    actual_stock: purchase.actual_stock,
    balance: purchase.balance,
    user_id: userStore?.user?.user?.id,
    company_id: userStore?.user?.user?.company_id,
  };

  if (edit_purchase.value) {
    data.id = selected_purchase.value.id;
    data.product = selected_purchase.value.product;
    if (!data.measurement) data.measurement = selected_purchase.value.measurement;

    editSelectedPurchase(data);
    loading.value = true;
  } else {
    newPurchase(data);
    loading.value = true;
  }
};

const { mutate: newPurchase } = useMutation((data) => post("purchases", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("today_purchases");
      add_new_purchase.value = false;
      notifyUser($q, data.message, "top-right", "orange");
      loading.value = false;
      clearInput();
    }
    if (data.status === "error") {
      loading.value = false;
      purchase.errorMessage = data.message;
      notifyUser($q, data.message, "top-right", "red");
    }
  },
});

const editPurchase = (data) => {
  (purchase.form_title = `Edit ${data.product}`),
    (purchase.product = data.product),
    (purchase.quantity = data.quantity),
    (purchase.issued = data.issued),
    (purchase.opening_stock = data.opening_stock),
    (purchase.closing_stock = data.closing_stock),
    (purchase.measurement = data.measurement),
    (purchase.total_amount = data.total_amount),
    (purchase.unit_price = data.unit_price),
    (purchase.balance = data.balance),
    (purchase.balance = data.balance),
    (purchase.payment_mode_id = data.payment_mode_id),
    (selected_purchase.value = data);

  add_new_purchase.value = true;
  edit_purchase.value = true;
};

const { mutate: editSelectedPurchase } = useMutation(
  (data) => update(`purchases/${data.id}`, data),
  {
    onSuccess: (data) => {
      if (data.status === "success") {
        queryClient.refetchQueries("today_purchases");
        add_new_purchase.value = false;
        notifyUser($q, data.message, "top-right", "orange");
        loading.value = false;
        clearInput();
      }
      if (data.status === "error") {
        loading.value = false;
        purchase.errorMessage = data.message;
        notifyUser($q, data.message, "top-right", "red");
      }
    },
  }
);

const clearInput = () => {
  purchase.product = "";
  purchase.quantity = 0;
  purchase.issued = 0;
  purchase.opening_stock = 0;
  purchase.closing_stock = 0;
  purchase.measurement = "";
  purchase.total_amount = 0;
  purchase.unit_price = 0;
  purchase.balance = 0;
  purchase.payment_mode_id = "";

  purchase.errorMessage = "";
  selected_purchase.value = "";
  add_new_purchase.value = false;
  edit_purchase.value = false;
  purchase.form_title = "Add New Purchase";
};

const resetForm = () => clearInput();

const filterDataWithPaymentMode = (data) => {
  reset.value = true;
  purchases_data.value = purchases_data_copy.value;
  purchases_data.value = purchases_data.value.filter(
    (val) => val.payment_mode == data.name
  );
  if (purchases_data.value.length < 1)
    notifyUser($q, `${data.name} has no entries yet.`, "top", "red");
};

const resetPurchases = () => {
  purchases_data.value = purchases_data_copy.value;
  reset.value = false;
};
</script>
