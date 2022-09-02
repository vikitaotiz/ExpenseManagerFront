<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else-if="data"
      title="All Parts"
      :rows="data"
      :columns="parts_columns"
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
            @click="editPart(props.row)"
            style="cursor: pointer"
            size="20px"
            class="q-mr-md"
          />
          <q-icon
            color="red"
            name="delete"
            @click="deletePart(props.row)"
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
          @click="add_new_part = true"
          round
          dense
          color="primary"
          size="small"
          icon="add"
        />
      </template>
    </q-table>

    <AddNewPartDialog v-model="add_new_part" @addPart="addPart" :part="part" />
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
import { parts_columns } from "src/utilities/columns/parts_columns";
import { util_pagination } from "src/utilities/util_pagination";
import AddNewPartDialog from "src/components/Parts/AddNewPartDialog.vue";

const userStore = useUserStore();
const queryClient = useQueryClient();
const $q = useQuasar();

const { data, isLoading, isError, error } = useQuery("parts", () =>
  getAll("parts", userStore.user?.token)
);

const pagination = ref(util_pagination(15));

const filter = ref("");
const add_new_part = ref(false);
const loading = ref(false);
const selected_part_id = ref("");
const edit_part = ref(false);

const part = reactive({
  name: "",
  errorMessage: "",
  form_title: "Add New Part",
});

const deletePart = (row) => {
  const delete_product = confirm("Are you sure you want to delete " + row.name + "?");
  if (delete_product) {
    loading.value = true;
    removePart(row.id);
  }
};

const { mutate: removePart } = useMutation((id) => deleteData(id, "parts"), {
  onSuccess: (data) => {
    queryClient.refetchQueries("parts");
    notifyUser($q, data.message, "top-right", "orange");
    loading.value = false;
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});

const addPart = () => {
  add_new_part.value = true;
  const data = { name: part.name };

  if (edit_part.value) {
    data.id = selected_part_id.value;
    editSelectedPart(data);
  } else {
    newPart(data);
    loading.value = true;
  }
};

const { mutate: newPart } = useMutation((data) => post("parts", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("parts");
      add_new_part.value = false;
      notifyUser($q, data.message, "top-right", "orange");
      loading.value = false;
      clearInput();
    }
    if (data.status === "error") {
      loading.value = false;
      part.errorMessage = data.message;
      notifyUser($q, data.message, "top-right", "red");
    }
  },
});

const editPart = (data) => {
  part.form_title = `Edit ${data.name}`;
  part.name = data.name;

  selected_part_id.value = data.id;
  add_new_part.value = true;
  edit_part.value = true;
};

const { mutate: editSelectedPart } = useMutation(
  (data) => update(`parts/${data.id}`, data),
  {
    onSuccess: (data) => {
      if (data.status === "success") {
        queryClient.refetchQueries("parts");
        add_new_part.value = false;
        notifyUser($q, data.message, "top-right", "orange");
        loading.value = false;
        clearInput();
      }
      if (data.status === "error") {
        loading.value = false;
        part.errorMessage = data.message;
        notifyUser($q, data.message, "top-right", "red");
      }
    },
  }
);

const clearInput = () => {
  part.name = "";
  part.errorMessage = "";

  selected_part_id.value = "";
  add_new_part.value = false;
  edit_part.value = false;
};
</script>
