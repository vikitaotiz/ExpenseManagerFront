<template>
  <q-dialog persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Add New Product</div>
        <small style="color: red">{{ errorMessage }}</small> </q-card-section
      ><q-separator class="q-mb-sm" />
      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col-xs-12 col-sm-4 col-md-4">
            <q-input
              dense
              outlined
              v-model="product.name"
              label="Product name..."
              type="text"
              class="q-ma-sm"
            />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4">
            <q-select
              v-if="product.name"
              clearable
              :options="ingredients"
              option-label="name"
              outlined
              v-model="single_ingredient"
              label="Select Raw Materials"
              dense
              class="q-ma-sm"
            />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 q-pt-sm">
            <q-btn
              v-if="single_ingredient"
              @click="addIngredient(single_ingredient)"
              dense
              icon="add"
              color="primary"
              class="full-width"
              label="Add Ingredient"
            />
          </div>
        </div>

        <small v-if="ingredients_array.length > 0" class="q-mr-lg">
          Raw Materials
          <q-separator /><small style="color: red">{{ errorIngredient }}</small>
          <q-card
            v-for="ingredient in ingredients_array"
            :key="ingredient.id"
            class="bg-blue text-white q-mb-sm"
            flat
          >
            <q-card-actions>
              <span
                ><b>{{ ingredient.name }}</b></span
              >
              <q-space />
              <span>Measured in {{ ingredient.processing_unit }}</span>
              <q-space />
              <span
                ><q-icon
                  @click="removeIngredient(ingredient)"
                  name="delete"
                  size="sm"
                  style="cursor: pointer"
              /></span>
            </q-card-actions>
          </q-card>
        </small>
        <q-separator />
        <div v-if="ingredients_array.length > 0">
          <q-checkbox v-model="desc" label="Product Description" />
        </div>
        <q-input
          v-if="desc"
          v-model="product.description"
          outlined
          type="textarea"
          label="Product description (optional)..."
          class="q-ma-sm"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
        <q-space />
        <q-btn
          v-if="ingredients_array.length > 0"
          @click="aggregateProductData"
          flat
          label="Add"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { notifyUser } from "src/utilities/commonMethods";
import { ref } from "vue";

const props = defineProps(["product", "parts", "ingredients", "errorMessage"]);

const emit = defineEmits(["addProduct"]);
const $q = useQuasar();

const single_ingredient = ref("");
const errorIngredient = ref("");
const all_ingredients = ref([]);
const desc = ref(false);

let ingredients_array = ref(JSON.parse(JSON.stringify(props.product.ingredient_content)));

const addIngredient = (ingredient) => {
  let data = {
    id: ingredient.id,
    buying_price: ingredient.buying_price,
    processing_unit: ingredient.processing_unit,
    name: ingredient.name,
    quantity: ingredient.quantity,
  };

  if (ingredients_array.value.find((x) => x.id === ingredient.id)) {
    errorIngredient.value = `${ingredient.name} already exists.`;
    notifyUser($q, `${ingredient.name} already exists.`, "top", "red");
  } else {
    ingredients_array.value.unshift(data);
    errorIngredient.value = "";
    single_ingredient.value = "";
  }
};

const removeIngredient = (data) =>
  (ingredients_array.value = ingredients_array.value.filter((val) => val.id !== data.id));

const aggregateProductData = () => {
  props.product.ingredient_content = ingredients_array.value;
  emit("addProduct");
};
</script>
