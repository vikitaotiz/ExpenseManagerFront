<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else
      title="All Roles"
      :rows="data"
      :columns="roles_columns"
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
            @click="editRole(props.row)"
            style="cursor: pointer"
            size="20px"
            class="q-mr-md"
          />
          <q-icon
            color="red"
            name="delete"
            @click="deleteRole(props.row)"
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
          @click="add_new_role = true"
          round
          dense
          color="primary"
          size="small"
          icon="add"
        />
      </template>
    </q-table>

    <AddNewRoleDialog v-model="add_new_role" @addRole="addRole" :role="role" />
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
import { useMutation, useQuery, useQueryClient } from "vue-query";

import { getAll, post, update } from "src/utilities/fetchWrapper.js";
import { deleteData, notifyUser } from "src/utilities/commonMethods";
import { useUserStore } from "src/stores/user-store.js";
import { roles_columns } from "src/utilities/columns/roles_columns";
import { util_pagination } from "src/utilities/util_pagination";
import AddNewRoleDialog from "src/components/Roles/AddNewRoleDialog.vue";

const userStore = useUserStore();
const queryClient = useQueryClient();
const $q = useQuasar();

const { data, isLoading, isError, error } = useQuery("roles", () =>
  getAll("roles", userStore.user?.token)
);

const pagination = ref(util_pagination(15));

const filter = ref("");
const add_new_role = ref(false);
const loading = ref(false);
const selected_role_id = ref("");
const edit_role = ref(false);

const role = reactive({
  name: "",
  errorMessage: "",
  form_title: "Add New Role",
});

const deleteRole = (row) => {
  const delete_product = confirm("Are you sure you want to delete " + row.name + "?");
  if (delete_product) {
    loading.value = true;
    removeRole(row.id);
  }
};

const { mutate: removeRole } = useMutation((id) => deleteData(id, "roles"), {
  onSuccess: (data) => {
    queryClient.refetchQueries("roles");
    notifyUser($q, data.message, "top-right", "orange");
    loading.value = false;
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});

const addRole = () => {
  add_new_role.value = true;
  const data = { name: role.name };

  if (edit_role.value) {
    data.id = selected_role_id.value;
    editSelectedRole(data);
  } else {
    newRole(data);
    loading.value = true;
  }
};

const { mutate: newRole } = useMutation((data) => post("roles", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("roles");
      add_new_role.value = false;
      notifyUser($q, data.message, "top-right", "orange");
      loading.value = false;
      clearInput();
    }
    if (data.status === "error") {
      loading.value = false;
      role.errorMessage = data.message;
      notifyUser($q, data.message, "top-right", "red");
    }
  },
});

const editRole = (data) => {
  role.form_title = `Edit ${data.name}`;
  role.name = data.name;

  selected_role_id.value = data.id;
  add_new_role.value = true;
  edit_role.value = true;
};

const { mutate: editSelectedRole } = useMutation(
  (data) => update(`roles/${data.id}`, data),
  {
    onSuccess: (data) => {
      if (data.status === "success") {
        queryClient.refetchQueries("roles");
        add_new_role.value = false;
        notifyUser($q, data.message, "top-right", "orange");
        loading.value = false;
        clearInput();
      }
      if (data.status === "error") {
        loading.value = false;
        role.errorMessage = data.message;
        notifyUser($q, data.message, "top-right", "red");
      }
    },
  }
);

const clearInput = () => {
  role.name = "";
  role.errorMessage = "";

  selected_role_id.value = "";
  add_new_role.value = false;
  edit_role.value = false;
};
</script>
