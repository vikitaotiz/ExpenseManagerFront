<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else-if="data"
      title="All Companies"
      :rows="data"
      :columns="company_columns"
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
          @click="addCompanyDialog = true"
          round
          dense
          color="primary"
          size="small"
          icon="add"
        />
      </template>
    </q-table>

    <NewCompanyDialog
      @addCompany="addCompany"
      v-model="addCompanyDialog"
      :company="company"
      :errorMessage="errorMessage"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useMutation, useQuery, useQueryClient } from "vue-query";

import {
  combineCodeNumber,
  fetchData,
  notifyUser,
  validatePhone,
} from "src/utilities/commonMethods";
import { company_columns } from "src/utilities/columns/company_columns";
import { util_pagination } from "src/utilities/util_pagination";
import NewCompanyDialog from "src/components/Companies/NewCompanyDialog.vue";
import { post } from "src/utilities/fetchWrapper";

const { data, isLoading, isError, error } = useQuery(
  "companies",
  () => fetchData("companies"),
  { onSuccess: (data) => (companies.value = data) }
);

const $q = useQuasar();
const queryClient = useQueryClient();

const pagination = ref(util_pagination(15));
const companies = ref([]);
const filter = ref("");
const addCompanyDialog = ref(false);
const errorMessage = ref("");
const loading = ref(false);

const company = reactive({
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  country: "",

  phoneNumber: "0714581597",
  phoneError: "",
});

const addCompany = () => {
  if (!validatePhone(company.phoneNumber)) company.phoneError = "The number is invalid.";
  else if (company.country && company.phoneNumber && company.name) {
    const phone = combineCodeNumber(company.phoneNumber, company.country.dial_code);

    company.country = company.country.name;
    company.phone = phone.replace(/\s/g, "");
    delete company.phoneError;
    delete company.phoneNumber;

    addNewCompany(company);
    loading.value = true;
  } else {
    alert("Country, Phone and Password are required!");
  }
};

const { mutate: addNewCompany } = useMutation((data) => post("companies", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("companies");
      addCompanyDialog.value = false;
      notifyUser($q, data.message, "top-right", "orange");
      loading.value = false;
      clearInput();
    }
    if (data.status === "error") {
      loading.value = false;
      errorMessage.value = data.message;
      notifyUser($q, data.message, "top-right", "red");
    }
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});

const clearInput = () => {
  company.name = "";
  company.phone = "";
  company.email = "";
  company.address = "";
  company.city = "";
  company.country = "";
  company.phoneNumber = "";
  company.phoneError = "";
};

const columns = company_columns.map((val) => val.name);
</script>

<script>
import { useUserStore as store } from "src/stores/user-store";

export default {
  preFetch({ currentRoute, previousRoute, redirect }) {
    const useStore = store();
    !useStore?.user && redirect({ path: "/" });
  },
};
</script>
