<template>
  <q-dialog persistent>
    <q-card class="bg-primary text-white" style="width: 800px; max-width: 80vw">
      <q-card-actions>
        <div class="text-h6" text-color="primary">Raw Materials</div>
      </q-card-actions>
      <q-card-section>
        <q-card
          v-for="ingredient in product?.raw_materials"
          :key="ingredient.id"
          class="text-dark q-mb-sm q-pa-0"
          flat
        >
          <q-card-actions>
            <span
              ><b>{{ ingredient.name }}</b></span
            >
            <q-space />
            <span>Measured in {{ ingredient.processing_unit }}</span>
            <q-space />
            <span>
              <q-input
                type="number"
                v-model="ingredient.quantity"
                label="Quantity"
                dense
                class="q-ma-md"
              />
            </span>
          </q-card-actions>
        </q-card>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup /><q-space />
        <q-btn flat label="Confirm" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(["product"]);

const emit = defineEmits(["confirmRawMaterials"]);
</script>
