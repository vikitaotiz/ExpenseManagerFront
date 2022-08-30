<template>
  <q-dialog persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section class="row items-center">
        <span class="q-ml-sm"><b>Edit User</b></span>
      </q-card-section>
      <q-separator color="orange" />
      <q-card-section>
        <PhoneInput :user="user" />
        <div class="row">
          <div class="q-pa-sm col-xs-12 col-sm-4 col-md-4">
            <q-input outlined dense v-model="user.name" label="Name" />
          </div>
          <div class="q-pa-sm col-xs-12 col-sm-4 col-md-4">
            <q-input outlined dense v-model="user.email" label="Email" />
          </div>
          <div class="q-pa-sm col-xs-12 col-sm-4 col-md-4">
            <q-input
              type="password"
              outlined
              dense
              v-model="user.password"
              label="Password"
            />
          </div>
        </div>
        <div class="row">
          <div class="q-pa-sm col-xs-12 col-sm-6 col-md-6">
            <q-select
              dense
              outlined
              v-model="user.role"
              label="Select Role"
              :options="roles"
              option-label="name"
              class="q-mb-md"
            />
          </div>
          <div class="q-pa-sm col-xs-12 col-sm-6 col-md-6">
            <q-select
              dense
              outlined
              v-model="user.company"
              label="Select Company"
              :options="companies"
              option-label="name"
              class="q-mb-md"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
        <q-space />
        <q-btn @click="$emit('editSelectedUser')" flat label="Save" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import PhoneInput from "src/components/PhoneInput.vue";

defineProps(["user", "roles", "companies"]);

const emit = defineEmits(["editSelectedUser"]);
</script>
