<template>
  <q-dialog persistent>
    <q-card style="width: 750px; max-width: 80vw">
      <q-card-actions>
        <div class="text-h6" text-color="primary">
          {{ product.name.toUpperCase() }}
        </div>
        <q-space />
        <small style="color: red" class="q-pa-md">{{ errorMessage }}</small>
        <q-space />
        <span class="text-blue">Units : {{ product.unit }}</span>
      </q-card-actions>
      <q-separator color="blue" />

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col-xs-12 col-sm-9 col-md-9">
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
                />
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3">
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
              <div class="col-xs-12 col-sm-4 col-md-4">
                <q-input
                  v-if="entry.purchases"
                  type="number"
                  outlined
                  v-model="entry.usage"
                  label="Usage"
                  dense
                  class="q-ma-md"
                />
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4">
                <q-input
                  v-if="entry.usage"
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
          </div>
          <div
            v-if="entry.unit_price"
            class="col-xs-12 col-sm-3 col-md-3 q-pa-sm bg-blue calc q-mt-sm"
          >
            <span class="text-center"><b>Calculations</b></span
            ><q-separator color="orange" />
            <small>
              <ul>
                <li>Purchases Cost: {{ entry.unit_price * entry.purchases }}</li>
                <li>Usage Cost: {{ entry.unit_price * entry.usage }}</li>
                <li>Opening Stock Cost: {{ entry.unit_price * entry.opening_stock }}</li>
                <li>Closing Stock Cost: {{ entry.unit_price * entry.closing_stock }}</li>
              </ul>
            </small>
          </div>
        </div>
      </q-card-section>
      <q-separator color="primary" />
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup /><q-space />
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
defineProps(["product", "entry", "parts", "errorMessage"]);

const emit = defineEmits(["submitEntry"]);
</script>

<style setup>
.calc {
  /* background: #2196f3; */
  color: #fff;
  height: 100%;
  background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);
}
</style>
