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

    <q-dialog v-model="addUserDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"><b>Create New User</b></span>
        </q-card-section>

        <q-card-section>
          <div class="row">
            <div class="col">
              <q-input v-model="user.name" label="Name" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
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

const userStore = useUserStore();
const queryClient = useQueryClient();
const $q = useQuasar();

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
const addUserDialog = ref(false);
const loading = ref(false);

const user = reactive({
  name: "",
});

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
  { name: "created_at", label: "Created On", field: "created_at", sortable: true },
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
</script>
