<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else-if="data"
      title="All Users"
      :rows="data"
      :columns="columns"
      :grid="$q.screen.xs"
      row-key="name"
      separator="cell"
      v-model:pagination="pagination"
      :filter="filter"
      dense
    >
      <template v-slot:top-right>
        <q-spinner-grid v-if="loading" size="30px" color="primary" class="q-mr-md" />
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
      </template>
      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-icon
            color="info"
            name="edit"
            @click="editUser(props.row)"
            style="cursor: pointer"
            size="20px"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-delete="props">
        <q-td :props="props">
          <q-icon
            color="red"
            name="delete"
            @click="deleteUser(props.row)"
            style="cursor: pointer"
            size="20px"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="editUserDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <span class="q-ml-sm"><b>Edit User</b></span>
        </q-card-section>

        <q-card-section>
          <div class="row">
            <div class="q-pa-sm col-xs-12 col-sm-6 col-md-6">
              <q-select
                dense
                outlined
                v-model="user.country"
                use-input
                input-debounce="0"
                label="Select Country"
                :options="options"
                option-label="name"
                @filter="filterFn"
                class="q-mb-md"
                ><template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"> No results </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="q-pa-sm col-xs-12 col-sm-6 col-md-6">
              <code style="color: grey">e.g 0XXXXXXXXX - (start with zero)</code>
              <q-input
                dense
                type="tel"
                outlined
                v-model="phoneNumber"
                label="Enter your phone..."
              >
                <template v-slot:prepend>
                  <code style="color: #029e43; font-size: 15px; padding-top: 11px">{{
                    user?.country?.dial_code
                  }}</code>
                </template>
              </q-input>
              <small style="color: red"> {{ phoneError }}</small>
            </div>
          </div>
          <div class="row">
            <div class="q-pa-sm col-xs-12 col-sm-6 col-md-6">
              <q-select
                dense
                outlined
                v-model="user.role"
                label="Select Role"
                :options="roles"
                option-label="name"
                class="q-mb-md"
              />
            </div>
            <div class="q-pa-sm col-xs-12 col-sm-6 col-md-6">
              <q-input outlined dense v-model="user.name" label="Name" />
            </div>
          </div>
          <div class="row">
            <div class="q-pa-sm col-xs-12 col-sm-6 col-md-6">
              <q-input outlined dense v-model="user.email" label="Email" />
            </div>
            <div class="q-pa-sm col-xs-12 col-sm-6 col-md-6">
              <q-input outlined dense v-model="user.role" label="Role" />
            </div>
          </div>
          <div class="row">
            <div class="q-pa-sm col-xs-12 col-sm-6 col-md-6">
              <q-input outlined dense v-model="user.company" label="Company" />
            </div>
            <div class="q-pa-sm col-xs-12 col-sm-6 col-md-6">
              <q-input outlined dense v-model="user.password" label="Password" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-space />
          <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useQuery, useMutation, useQueryClient } from "vue-query";
import { getAll } from "src/utilities/fetchWrapper.js";
import { useUserStore } from "src/stores/user-store.js";
import { deleteData } from "src/utilities/commonMethods";
import { countries } from "src/utilities/countries";

import {
  validatePhone,
  filterCountries,
  combineCodeNumber,
} from "src/utilities/commonMethods";

const userStore = useUserStore();
const queryClient = useQueryClient();
const $q = useQuasar();

const country_data = countries();
const options = ref(country_data);

const { data, isLoading, isError, error } = useQuery("users", () =>
  getAll("users", userStore.user?.token)
);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 15,
});

const filter = ref("");
const roles = ref([]);
const editUserDialog = ref(false);
const loading = ref(false);

const user = reactive({
  name: "",
  phone: "",
  email: "",
  country: "",
  password: "",
  role: "",
  company: "",
});

const phoneNumber = ref("");
const phoneError = ref("");
const selected_user = ref("");

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
    name: "phone",
    align: "center",
    label: "Phone",
    field: "phone",
    sortable: true,
  },
  { name: "email", label: "Email", field: "email", sortable: true },
  { name: "role", label: "Role", field: "role", sortable: true },
  { name: "company", label: "Company", field: "company", sortable: true },
  { name: "country", label: "Country", field: "country", sortable: true },
  { name: "created_at", label: "Created On", field: "created_at", sortable: true },
  { name: "edit", label: "Edit" },
  { name: "delete", label: "Delete" },
];

const deleteUser = (row) => {
  const delete_product = confirm("Are you sure?");
  if (delete_product) {
    loading.value = true;
    removUser(row.id);
  }
};

const { mutate: removUser } = useMutation((id) => deleteData(id, "users"), {
  onSuccess: (data) => {
    queryClient.refetchQueries("users");
    $q.notify({
      message: "User deleted successfully.",
      color: "orange",
      position: "top-right",
    });
    loading.value = false;
  },
});

const editUser = (row) => {
  editUserDialog.value = true;

  user.name = row.name;
  user.phone = row.phone;
  user.email = row.email;
  user.country = row.country;
  user.password = "";
  user.role = row.role;
  user.company = row.company;
};

const filterFn = (val, update) => filterCountries(val, update, options, country_data);
</script>
