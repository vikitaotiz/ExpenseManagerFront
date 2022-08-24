<template>
  <q-dialog persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Add New Product</div>
        <small style="color: red">{{ errorMessage }}</small> </q-card-section
      ><q-separator class="q-mb-sm" />

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col">
            <q-input
              dense
              outlined
              v-model="product.name"
              label="Product name..."
              type="text"
              class="q-ma-sm"
            />
          </div>
          <div class="col">
            <q-select
              clearable
              :options="units"
              option-label="title"
              outlined
              v-model="product.unit_id"
              label="Measurement Unit"
              dense
              class="q-ma-sm"
            />
          </div>
          <div class="col">
            <q-select
              clearable
              :options="stores"
              option-label="name"
              outlined
              v-model="product.store_id"
              label="Store"
              dense
              class="q-ma-sm"
            />
          </div>
        </div>

        <q-input
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
          v-if="product.name && product.unit_id"
          @click="$emit('addProduct')"
          flat
          label="Add"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(["product", "units", "stores", "errorMessage"]);

const emit = defineEmits(["addProduct"]);
</script>
