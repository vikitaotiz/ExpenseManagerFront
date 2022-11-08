<template>
  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else
      title="All Tags"
      :rows="data"
      :columns="tags_columns"
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
            @click="editTag(props.row)"
            style="cursor: pointer"
            size="20px"
            class="q-mr-md"
          />
          <q-icon
            color="red"
            name="delete"
            @click="deleteTag(props.row)"
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
          @click="add_new_tag = true"
          round
          dense
          color="primary"
          size="small"
          icon="add"
        />
      </template>
    </q-table>

    <AddNewTagDialog v-model="add_new_tag" @addTag="addTag" :tag="tag" />
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
import { tags_columns } from "src/utilities/columns/tags_columns";
import { util_pagination } from "src/utilities/util_pagination";
import AddNewTagDialog from "src/components/Tags/AddNewTagDialog.vue";

const userStore = useUserStore();
const queryClient = useQueryClient();
const $q = useQuasar();

const { data, isLoading, isError, error } = useQuery("tags", () =>
  getAll("tags", userStore.user?.token)
);

const pagination = ref(util_pagination(15));

const filter = ref("");
const add_new_tag = ref(false);
const loading = ref(false);
const selected_tag_id = ref("");
const edit_tag = ref(false);

const tag = reactive({
  name: "",
  errorMessage: "",
  form_title: "Add New Tag",
});

const deleteTag = (row) => {
  const delete_product = confirm("Are you sure you want to delete " + row.name + "?");
  if (delete_product) {
    loading.value = true;
    removeTag(row.id);
  }
};

const { mutate: removeTag } = useMutation((id) => deleteData(id, "tags"), {
  onSuccess: (data) => {
    queryClient.refetchQueries("tags");
    notifyUser($q, data.message, "top-right", "orange");
    loading.value = false;
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});

const addTag = () => {
  add_new_tag.value = true;
  const data = { name: tag.name };

  if (edit_tag.value) {
    data.id = selected_tag_id.value;
    editSelectedTag(data);
  } else {
    newTag(data);
    loading.value = true;
  }
};

const { mutate: newTag } = useMutation((data) => post("tags", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("tags");
      add_new_tag.value = false;
      notifyUser($q, data.message, "top-right", "orange");
      loading.value = false;
      clearInput();
    }
    if (data.status === "error") {
      loading.value = false;
      tag.errorMessage = data.message;
      notifyUser($q, data.message, "top-right", "red");
    }
  },
});

const editTag = (data) => {
  tag.form_title = `Edit ${data.name}`;
  tag.name = data.name;

  selected_tag_id.value = data.id;
  add_new_tag.value = true;
  edit_tag.value = true;
};

const { mutate: editSelectedTag } = useMutation(
  (data) => update(`tags/${data.id}`, data),
  {
    onSuccess: (data) => {
      if (data.status === "success") {
        queryClient.refetchQueries("tags");
        add_new_tag.value = false;
        notifyUser($q, data.message, "top-right", "orange");
        loading.value = false;
        clearInput();
      }
      if (data.status === "error") {
        loading.value = false;
        tag.errorMessage = data.message;
        notifyUser($q, data.message, "top-right", "red");
      }
    },
  }
);

const clearInput = () => {
  tag.name = "";
  tag.errorMessage = "";

  selected_tag_id.value = "";
  add_new_tag.value = false;
  edit_tag.value = false;
};
</script>
