<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else-if="data"
      title="Measurement Units"
      :rows="data"
      :columns="units_columns"
      :grid="$q.screen.xs"
      row-key="title"
      separator="cell"
      v-model:pagination="pagination"
      :filter="filter"
      dense
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <!-- <q-icon
            color="blue"
            name="edit"
            @click="editIngredient(props.row)"
            style="cursor: pointer"
            size="20px"
            class="q-mr-md"
          /> -->
          <q-icon
            color="red"
            name="delete"
            @click="deleteUnit(props.row)"
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
          @click="unitDialog = true"
          round
          dense
          color="primary"
          size="small"
          icon="add"
        />
      </template>
    </q-table>

    <q-dialog v-model="unitDialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Add Measurement Unit</div>
        </q-card-section>
        <q-separator />

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col">
              <q-input
                dense
                outlined
                v-model="title"
                label="Enter title..."
                class="q-ma-sm"
              />
            </div>
            <div class="col">
              <q-input
                v-if="title"
                dense
                outlined
                v-model="symbol"
                label="Enter symbol..."
                class="q-ma-sm"
              />
            </div>
          </div>
          <small style="color: red">{{ errorMessage }}</small>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-space />
          <q-btn
            v-if="symbol"
            @click="addMeasurementUnit"
            flat
            label="Submit"
            color="primary"
          />
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

import { getAll, post } from "src/utilities/fetchWrapper.js";
import { useUserStore } from "src/stores/user-store.js";
import { util_pagination } from "src/utilities/util_pagination";
import { units_columns } from "src/utilities/columns/units_columns";
import { deleteData, notifyUser } from "src/utilities/commonMethods";

const userStore = useUserStore();
const queryClient = useQueryClient();
const $q = useQuasar();

const { data, isLoading, isError, error } = useQuery("units", () =>
  getAll("units", userStore.user?.token)
);

const pagination = ref(util_pagination(15));

const filter = ref("");
const unitDialog = ref(false);
const loading = ref(false);
const title = ref("");
const symbol = ref("");
const errorMessage = ref("");

const addMeasurementUnit = () => {
  if (title.value && symbol.value)
    addUnit({
      title: title.value,
      symbol: symbol.value,
    });

  loading.value = true;
};

const { mutate: addUnit } = useMutation((data) => post("units", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("units");
      unitDialog.value = false;
      loading.value = false;
      notifyUser($q, data.message, "top-right", "orange");
    }
    if (data.status === "error") {
      loading.value = false;
      errorMessage.value = data.message;
      notifyUser($q, data.message, "top-right", "red");
    }
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    unitDialog.value = false;
  },
});

const deleteUnit = (row) => {
  const delete_product = confirm("Are you sure you want to delete " + row.name + "?");
  if (delete_product) {
    loading.value = true;
    removeUnit(row.id);
  }
};

const { mutate: removeUnit } = useMutation((id) => deleteData(id, "units"), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("units");
      notifyUser($q, data.message, "top-right", "orange");
      loading.value = false;
    }
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});
</script>
