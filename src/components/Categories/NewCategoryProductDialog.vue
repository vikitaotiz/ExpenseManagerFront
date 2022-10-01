<template>
  <q-dialog persistent>
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">{{ product.formTitle }}</div>
        <small style="color: red">{{ errorMessage }}</small> </q-card-section
      ><q-separator class="q-mb-sm" />
      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <q-select
              dense
              outlined
              v-model="product.name"
              use-input
              input-debounce="0"
              label="Select Product"
              :options="options1"
              option-label="name"
              @filter="filterFn1"
              class="q-mb-md"
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No results </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12">
            <q-input
              v-if="product.name"
              dense
              outlined
              v-model="product.selling_price"
              label="Selling Price..."
              type="number"
              class="q-ma-sm"
            />
          </div>
        </div>
        <q-separator />
        <div v-if="product.selling_price">
          <q-checkbox v-model="desc" label="Product Description (Optional)" />
        </div>
        <q-input
          v-if="desc && product.selling_price"
          v-model="product.description"
          outlined
          type="textarea"
          label="Product description (optional)..."
          class="q-ma-sm"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          @click="$emit('resetForm')"
          flat
          label="Cancel"
          color="red"
          v-close-popup
        />
        <q-space />
        <q-btn
          v-if="product.selling_price"
          @click="$emit('addProduct')"
          flat
          label="Save"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { filterData } from "src/utilities/commonMethods";

const props = defineProps(["product", "errorMessage", "raw_materials"]);

const emit = defineEmits(["addProduct", "resetForm"]);

const options1 = ref(props.raw_materials);

const filterFn1 = (val, update) => filterData(val, update, options1, props.raw_materials);

const desc = ref(false);
</script>
