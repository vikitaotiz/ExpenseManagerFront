<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else-if="data"
      :title="`${data?.company_name?.toUpperCase()} entries`"
      :rows="data?.data"
      :columns="today_entry_columns"
      :grid="$q.screen.xs"
      row-key="product"
      separator="cell"
      v-model:pagination="pagination"
      :filter="filter"
      dense
    >
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
      </template>

      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-icon color="info" name="edit" style="cursor: pointer" size="20px" />
        </q-td>
      </template>
      <template v-slot:body-cell-delete="props">
        <q-td :props="props">
          <q-icon
            color="red"
            name="delete"
            @click="deleteEntry(props.row)"
            style="cursor: pointer"
            size="20px"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import { useQuasar } from "quasar";

import { getSingle } from "src/utilities/fetchWrapper.js";
import { useUserStore } from "src/stores/user-store.js";
import { useRouter, useRoute } from "vue-router";
import { today_entry_columns } from "src/utilities/columns/today_entry_columns";
import { util_pagination } from "src/utilities/util_pagination";
import { deleteData, notifyUser } from "src/utilities/commonMethods";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const queryClient = useQueryClient();
const $q = useQuasar();

const { data, isLoading, isError, error } = useQuery(
  ["today_entries", route.params.slug],
  () => getSingle("today_entries", route.params.slug)
);

const pagination = ref(util_pagination(15));

const filter = ref("");
const loading = ref(false);

const deleteEntry = (row) => {
  const delete_entry = confirm(`Are you sure you want to delete ${row.product}`);
  if (delete_entry) {
    loading.value = true;
    removeEntry(row.id);
  }
};

const { mutate: removeEntry } = useMutation((id) => deleteData(id, "entries"), {
  onSuccess: (data) => {
    queryClient.refetchQueries("entries");
    notifyUser($q, data.message, "top-right", "orange");
    loading.value = false;
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});
</script>
