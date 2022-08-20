<template>
  <q-dialog persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-actions>
        <div class="text-h6" text-color="primary">
          {{ product.name.toUpperCase() }}
        </div>
        <q-space />
        <small style="color: red" class="q-pa-md">{{ errorMessage }}</small>
        <q-space />
        <span>Units : {{ product.unit }}</span>
      </q-card-actions>
      <q-separator />

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
      </q-card-section>
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
