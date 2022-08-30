<template>
  <q-dialog persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section> <div class="text-h6">Add New Store</div> </q-card-section
      ><q-separator class="q-mb-sm" />

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col q-pa-sm">
            <q-input
              dense
              outlined
              v-model="company_store.name"
              label="Store name..."
              type="text"
              class="q-mb-md"
              autofocus
            />
          </div>
          <div class="col q-pa-sm">
            <q-select
              dense
              outlined
              v-model="company_store.company"
              :options="companies"
              option-label="name"
              label="Company"
              v-if="company_store.name"
            />
          </div>
        </div>
        <q-input
          class="q-ma-sm"
          v-model="company_store.description"
          outlined
          type="textarea"
          label="Store description (optional)..."
          v-if="company_store.company"
        />

        <small style="color: red">{{ company_store.errorMessage }}</small>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
        <q-space />
        <q-btn
          v-if="company_store.company"
          @click="$emit('addStore')"
          flat
          label="Add"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(["company_store", "companies"]);

const emit = defineEmits(["addStore"]);
</script>
