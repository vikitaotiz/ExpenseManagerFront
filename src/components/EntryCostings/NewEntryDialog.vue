<template>
  <q-dialog persistent>
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-actions>
        <div class="text-h6" text-color="primary">
          {{ product.name.toUpperCase() }}
        </div>
        <q-space />
        <small style="color: red" class="q-pa-md">{{ errorMessage }}</small>
        <q-space />
        <small v-if="todayOpeningStockLoading">Loading Opening Stock</small>
        <small v-if="todayOpeningStockError">There was an error</small>
        <q-space />
        <span class="text-blue">
          <b>Ksh : {{ product.selling_price }}</b></span
        >
      </q-card-actions>
      <q-separator color="blue" />

      <q-card-section class="q-pt-none">
        <small>
          Description :
          {{
            product.description ? product.description : "No product description."
          }}</small
        >
        <q-separator />
        <div class="row">
          <div class="col-xs-12 col-sm-4 col-md-4">
            <q-input
              type="number"
              outlined
              v-model="entry.opening_stock"
              label="Opening Stock"
              dense
              class="q-ma-md"
              :disable="lockOpeningStock"
            />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4">
            <q-input
              v-if="entry.opening_stock"
              type="number"
              outlined
              v-model="entry.closing_stock"
              label="Closing Stock"
              dense
              class="q-ma-md"
            />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4">
            <q-input
              v-if="entry.closing_stock"
              type="number"
              outlined
              v-model="entry.purchases"
              label="Purchases"
              dense
              class="q-ma-md"
            />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4"></div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-sm-4 col-md-4">
            <q-card v-if="entry.purchases" flat bordered class="q-ma-md q-pa-sm">
              Usage / Sales : {{ usage }}
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4">
            <q-input
              type="number"
              outlined
              v-model="entry.system_usage"
              label="Sytem usage"
              dense
              class="q-ma-md"
            />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4">
            <q-select
              v-if="entry.system_usage"
              clearable
              :options="parts"
              option-label="name"
              option-value="name"
              outlined
              v-model="entry.part"
              label="Measurements"
              dense
              class="q-ma-md"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator color="primary" />
      <q-card-actions align="right">
        <q-btn
          @click="$emit('closeDialog')"
          flat
          label="Cancel"
          color="red"
          v-close-popup
        /><q-space />
        <q-btn
          v-if="entry.part"
          @click="$emit('submitEntry')"
          flat
          label="Submit Entry"
          color="primary"
        />
      </q-card-actions>
      <ProductRawMaterialsDialog v-model="raw_materials" :product="product" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from "vue";
// import Calculations from "src/components/EntryCostings/Calculations.vue";
import ProductRawMaterialsDialog from "./ProductRawMaterialsDialog.vue";

const raw_materials = ref(false);

let { entry, product, lockOpeningStock } = defineProps([
  "product",
  "entry",
  "parts",
  "errorMessage",
  "todayOpeningStockLoading",
  "todayOpeningStockError",
  "lockOpeningStock",
]);

const usage = computed(() => {
  let res = 0;
  res = Number(entry.opening_stock) + Number(entry.purchases) - entry.closing_stock;
  entry.usage = res;
  return res ? res : 0;
});

const emit = defineEmits(["submitEntry", "closeDialog"]);
</script>
