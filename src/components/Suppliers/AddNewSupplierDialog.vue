<template>
  <q-dialog persistent>
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section class="row items-center">
        <span class="q-ml-sm"
          ><b>{{ supplier.form_title }}</b></span
        >
      </q-card-section>
      <q-separator color="orange" />
      <q-card-section>
        <q-input outlined dense v-model="supplier.name" label="Name" class="q-mb-sm" />
        <q-input
          v-if="supplier.name"
          outlined
          dense
          v-model="supplier.phone"
          label="Phone"
          class="q-mb-sm"
        />

        <q-select
          v-if="supplier.phone"
          dense
          outlined
          v-model="supplier.company_id"
          label="Select company"
          :options="companies"
          option-label="name"
          class="q-mb-sm"
        />

        <q-input
          v-if="supplier.company_id"
          outlined
          dense
          v-model="supplier.address"
          label="Address (optional)"
          class="q-mb-sm"
        />

        <small style="color: red">{{ supplier.errorMessage }}</small>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
        <q-space />
        <q-btn
          v-if="supplier.company_id"
          @click="$emit('addSupplier')"
          flat
          label="Save"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(["supplier", "companies"]);

const emit = defineEmits(["addSupplier"]);
</script>
