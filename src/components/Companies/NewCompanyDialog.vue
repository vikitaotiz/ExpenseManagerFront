<template>
  <q-dialog persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Add New Company</div>
        <small style="color: red">{{ errorMessage }}</small> </q-card-section
      ><q-separator class="q-mb-sm" />

      <q-card-section class="q-pt-none">
        <PhoneInput :user="company" />
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6">
            <q-input
              dense
              outlined
              v-model="company.name"
              label="Company name..."
              type="text"
              class="q-ma-sm"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <q-input
              dense
              outlined
              v-model="company.email"
              label="Company email..."
              type="email"
              class="q-ma-sm"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6">
            <q-input
              dense
              outlined
              v-model="company.address"
              label="Company address..."
              type="text"
              class="q-ma-sm"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <q-input
              dense
              outlined
              v-model="company.city"
              label="Company city..."
              type="text"
              class="q-ma-sm"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
        <q-space />
        <q-btn
          v-if="company.name"
          @click="$emit('addCompany')"
          flat
          label="Add"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import PhoneInput from "src/components/PhoneInput.vue";
defineProps(["company", "errorMessage"]);

const emit = defineEmits(["addCompany"]);
</script>
