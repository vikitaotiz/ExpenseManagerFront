<template>
  <q-dialog persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section class="row items-center">
        <span class="q-ml-sm"
          ><b>{{ ingredient.form_title }}</b></span
        >
        <q-space />
        <span lab flat bordered
          ><b
            >Total Cost :
            {{
              ingredient.buying_price ? ingredient.buying_price * ingredient.quantity : 0
            }}</b
          ></span
        >
      </q-card-section>
      <q-separator color="orange" />
      <q-card-section>
        <div class="row">
          <div class="q-pa-sm col-xs-12 col-sm-4 col-md-4">
            <q-input outlined dense v-model="ingredient.name" label="Name" />
          </div>
          <div class="q-pa-sm col-xs-12 col-sm-4 col-md-4">
            <q-select
              v-if="ingredient.name"
              dense
              outlined
              v-model="ingredient.input_unit"
              label="Input Measurement"
              :options="units"
              option-label="title"
              class="q-mb-md"
            />
          </div>

          <div class="q-pa-sm col-xs-12 col-sm-4 col-md-4">
            <q-select
              v-if="ingredient.input_unit"
              dense
              outlined
              v-model="ingredient.processing_unit"
              label="Processing Measurement"
              :options="parts"
              option-label="name"
              class="q-mb-md"
            />
          </div>
        </div>
        <div class="row">
          <div class="q-pa-sm col-xs-12 col-sm-4 col-md-4">
            <q-input
              v-if="ingredient.processing_unit"
              type="number"
              outlined
              dense
              v-model="ingredient.quantity"
              label="Quantity"
            />
          </div>
          <div class="q-pa-sm col-xs-12 col-sm-4 col-md-4">
            <q-input
              v-if="ingredient.quantity"
              type="number"
              outlined
              dense
              v-model="ingredient.buying_price"
              label="Buying Price Per Quantity"
            />
          </div>

          <div class="q-pa-sm col-xs-12 col-sm-4 col-md-4">
            <q-select
              v-if="ingredient.buying_price"
              dense
              outlined
              v-model="ingredient.store_id"
              label="Select Store"
              :options="stores"
              option-label="name"
              class="q-mb-md"
            />
          </div>
        </div>
        <small style="color: red">{{ ingredient.errorMessage }}</small>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
        <q-space />
        <q-btn
          v-if="ingredient.store_id"
          @click="$emit('addIngredient')"
          flat
          label="Save"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(["ingredient", "units", "parts", "stores"]);

const emit = defineEmits(["addIngredient"]);
// $table->string("input_unit"); // $table->string("processing_unit");
</script>
