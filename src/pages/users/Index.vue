<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred</div>
    <q-table
      v-else
      title="All Users"
      :rows="users"
      :columns="users_columns"
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

    <UpdateUserDialog
      @editSelectedUser="editSelectedUser"
      v-model="editUserDialog"
      :user="user"
      :roles="roles"
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

import { deleteData, fetchData } from "src/utilities/commonMethods";
import { users_columns } from "src/utilities/columns/users_columns";

import { validatePhone, combineCodeNumber } from "src/utilities/commonMethods";
import { util_pagination } from "src/utilities/util_pagination";
import UpdateUserDialog from "src/components/users/UpdateUserDialog.vue";
import { update } from "src/utilities/fetchWrapper";

const queryClient = useQueryClient();
const $q = useQuasar();

const { data: users, isLoading, isError } = useQuery("users", () => fetchData("users"));
const { data: roles } = useQuery("roles", () => fetchData("roles"));
const { data: companies } = useQuery("companies", () => fetchData("companies"));

const pagination = ref(util_pagination(15));

const filter = ref("");
const editUserDialog = ref(false);
const loading = ref(false);
const user_id = ref("");

const user = reactive({
  name: "",
  phone: "",
  email: "",
  country: "",
  password: "",
  role: "",
  company: "",
  phoneNumber: "",
  phoneError: "",
  dial_code: "",
});

const deleteUser = (row) => {
  const delete_product = confirm("Are you sure?");
  if (delete_product) {
    loading.value = true;
    removeUser(row.id);
  }
};

const { mutate: removeUser } = useMutation((id) => deleteData(id, "users"), {
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
  user_id.value = row.id;
  user.name = row.name;
  user.phoneNumber = `0${row.phone.substring(4)}`;
  user.phone = row.phone;
  user.email = row.email;
  user.country = row.country;
  user.password = "";
  user.role = row.role;
  user.company = row.company;
  user.dial_code = row.phone.substring(0, 4);
};

const editSelectedUser = () => {
  if (!validatePhone(user.phoneNumber)) user.phoneError = "The number is invalid.";
  else if (user.country && user.phoneNumber && user.name && user.password) {
    const phone = combineCodeNumber(user.phoneNumber, user.dial_code);
    const country_name = user.country.name;
    user.phone = phone.replace(/\s/g, "");
    user.country = country_name;
    delete user.dial_code;
    delete user.phoneError;
    delete user.phoneNumber;

    updateUser(user);
    loading.value = true;
  } else {
    alert("Country, Phone and Password are required!");
  }
};

const { mutate: updateUser } = useMutation(
  (data) => update(`users/${user_id.value}`, data),
  {
    onSuccess: (data) => {
      if (data.status === "success") {
        queryClient.refetchQueries("users");
        $q.notify({
          message: data.message,
          color: "orange",
          position: "top-right",
        });
        loading.value = false;
        editUserDialog.value = false;
      }
    },
  }
);
</script>
