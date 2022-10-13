<template>
  <CommonHeader :section_title="'All Raw Materials'" />

  <div class="q-pa-md">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <q-table
      v-else
      :rows="ingredients"
      :columns="ingredient_columns"
      :grid="$q.screen.xs"
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
            @click="editIngredient(props.row)"
            style="cursor: pointer"
            size="20px"
            class="q-mr-md"
          />
          <q-icon
            color="red"
            name="delete"
            @click="deleteIngredient(props.row)"
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
          @click="add_new_ingredient = true"
          round
          dense
          color="primary"
          size="small"
          icon="add"
        />
      </template>
    </q-table>

    <AddNewIngredientDialog
      @addIngredient="addIngredient"
      v-model="add_new_ingredient"
      :ingredient="ingredient"
      :units="units"
      :stores="stores"
      :parts="parts"
      @resetForm="resetForm"
      :categories="categories"
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
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useQuery, useMutation, useQueryClient } from "vue-query";

import { deleteData, fetchData, notifyUser } from "src/utilities/commonMethods";
import { post, update } from "src/utilities/fetchWrapper";
import { useUserStore } from "src/stores/user-store.js";
import { util_pagination } from "src/utilities/util_pagination";
import { ingredient_columns } from "src/utilities/columns/ingredient_columns";
import AddNewIngredientDialog from "src/components/Ingredients/AddNewIngredientDialog.vue";
import CommonHeader from "src/components/CommonHeader.vue";

const userStore = useUserStore();
const queryClient = useQueryClient();
const $q = useQuasar();

const { data: ingredients, isLoading, isError, error } = useQuery("ingredients", () =>
  fetchData("ingredients")
);

// const { data: suppliers } = useQuery("suppliers", () => fetchData("suppliers"));

const { data: categories } = useQuery("material_categories", () =>
  fetchData("material_categories")
);

const { data: units } = useQuery("units", () => fetchData("units"));
const { data: stores } = useQuery("stores", () => fetchData("stores"));
const { data: parts } = useQuery("parts", () => fetchData("parts"));

const pagination = ref(util_pagination(15));

const filter = ref("");
const loading = ref(false);
const add_new_ingredient = ref(false);
const edit_ingredient = ref(false);
const selected_ingredient_id = ref("");

let ingredient = reactive({
  name: "",
  buying_price: 0,
  input_unit: "",
  processing_unit: "",
  store_id: "",
  category_id: "",
  // supplier_id: "",
  errorMessage: "",
  form_title: "Create New Ingredient",
});

const deleteIngredient = (row) => {
  const delete_product = confirm("Are you sure you want to delete " + row.name + "?");
  if (delete_product) {
    loading.value = true;
    removeIngredient(row.id);
  }
};

const { mutate: removeIngredient } = useMutation((id) => deleteData(id, "ingredients"), {
  onSuccess: (data) => {
    queryClient.refetchQueries("ingredients");
    notifyUser($q, data.message, "top-right", "orange");
    loading.value = false;
  },

  onError: (error) => {
    notifyUser($q, `There was an error : ${error}`, "top-right", "red");
    loading.value = false;
  },
});

const addIngredient = () => {
  const data = {
    name: ingredient.name,
    buying_price: ingredient.buying_price,
    input_unit: ingredient.input_unit.title,
    processing_unit: ingredient.processing_unit.name,
    store_id: ingredient.store_id.id,
    material_category_id: ingredient.category_id.id,
  };

  if (edit_ingredient.value) {
    data.id = selected_ingredient_id.value;
    editSelectedIngredient(data);
  } else {
    newIngredient(data);
    loading.value = true;
  }
};

const { mutate: newIngredient } = useMutation((data) => post("ingredients", data), {
  onSuccess: (data) => {
    if (data.status === "success") {
      queryClient.refetchQueries("ingredients");
      add_new_ingredient.value = false;
      notifyUser($q, data.message, "top-right", "orange");
      loading.value = false;
      clearInput();
    }
    if (data.status === "error") {
      loading.value = false;
      ingredient.errorMessage = data.message;
      notifyUser($q, data.message, "top-right", "red");
    }
  },
});

const editIngredient = (data) => {
  ingredient.form_title = `Edit ${data.name}`;
  ingredient.name = data.name;
  ingredient.buying_price = data.buying_price;
  ingredient.input_unit = data.input_unit;
  ingredient.processing_unit = data.processing_unit;
  ingredient.store_id = data.store_id;
  ingredient.category_id = data.category_id;

  selected_ingredient_id.value = data.id;
  add_new_ingredient.value = true;
  edit_ingredient.value = true;
};

const { mutate: editSelectedIngredient } = useMutation(
  (data) => update(`ingredients/${data.id}`, data),
  {
    onSuccess: (data) => {
      if (data.status === "success") {
        queryClient.refetchQueries("ingredients");
        add_new_ingredient.value = false;
        notifyUser($q, data.message, "top-right", "orange");
        loading.value = false;
        clearInput();
      }
      if (data.status === "error") {
        loading.value = false;
        ingredient.errorMessage = data.message;
        notifyUser($q, data.message, "top-right", "red");
      }
    },
  }
);

const clearInput = () => {
  ingredient.name = "";
  ingredient.buying_price = 0;
  ingredient.input_unit = "";
  ingredient.processing_unit = "";
  ingredient.store_id = "";
  ingredient.category_id = "";
  ingredient.errorMessage = "";

  selected_ingredient_id.value = "";
  add_new_ingredient.value = false;
  edit_ingredient.value = false;
  ingredient.form_title = "Create New Ingredient";
};

const resetForm = () => clearInput();
</script>
