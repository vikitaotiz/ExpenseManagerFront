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
        <span class="text-blue">Units : {{ product.unit }}</span>
      </q-card-actions>
      <q-separator color="blue" />

      <q-card-section class="q-pt-none">
        <small
          >Description :
          {{
            product.description ? product.description : "No product description."
          }}</small
        >
        <q-separator />
        <div class="row">
          <div class="col-xs-12 col-sm-3 col-md-3">
            <q-input
              type="number"
              outlined
              v-model="entry.unit_price"
              label="Unit Price"
              dense
              class="q-ma-md"
            />
          </div>
          <div class="col-xs-12 col-sm-3 col-md-3">
            <q-input
              v-if="entry.unit_price"
              type="number"
              outlined
              v-model="entry.opening_stock"
              label="Opening Stock"
              dense
              class="q-ma-md"
              :disable="lockOpeningStock"
            />
          </div>
          <div class="col-xs-12 col-sm-3 col-md-3">
            <q-input
              v-if="entry.unit_price && entry.opening_stock"
              type="number"
              outlined
              v-model="entry.closing_stock"
              label="Closing Stock"
              dense
              class="q-ma-md"
            />
          </div>
          <div class="col-xs-12 col-sm-3 col-md-3">
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
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-3 col-md-3">
            <q-input
              v-if="entry.purchases"
              type="number"
              outlined
              v-model="entry.selling_price"
              label="Selling Price"
              dense
              class="q-ma-md"
            />
          </div>
          <div class="col-xs-12 col-sm-3 col-md-3">
            <q-card v-if="entry.selling_price" flat bordered class="q-ma-md q-pa-sm">
              Usage / Sales : {{ usage }}
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-3 col-md-3">
            <q-input
              v-if="entry.selling_price && usage"
              type="number"
              outlined
              v-model="entry.system_usage"
              label="Sytem usage"
              dense
              class="q-ma-md"
            />
          </div>
          <div class="col-xs-12 col-sm-3 col-md-3">
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

      <q-expansion-item
        v-if="entry.unit_price"
        class="shadow-1 overflow-hidden q-ma-sm"
        style="border-radius: 30px"
        icon="blur_linear"
        label="Show Calculations"
        header-class="bg-blue text-white"
        expand-icon-class="text-white"
        dense
      >
        <q-card bordered flat class="q-pa-sm">
          <Calculations :entry="entry" />
        </q-card>
      </q-expansion-item>

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
    </q-card>
  </q-dialog>
</template>

<script setup>
import Calculations from "src/components/EntryCostings/Calculations.vue";
import { computed } from "vue";

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
  res = entry.opening_stock - entry.closing_stock;
  return res ? res : 0;
});

const emit = defineEmits(["submitEntry", "closeDialog"]);
</script>

<style setup>
.calc {
  /* background: #2196f3; */
  color: #fff;
  height: 100%;
  background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);
}
</style>
