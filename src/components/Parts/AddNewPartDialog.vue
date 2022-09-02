<template>
  <q-dialog persistent>
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section class="row items-center">
        <span class="q-ml-sm"
          ><b>{{ part.form_title }}</b></span
        >
      </q-card-section>
      <q-separator color="orange" />
      <q-card-section>
        <q-input outlined dense v-model="part.name" label="Name" />
        <small style="color: red">{{ part.errorMessage }}</small>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
        <q-space />
        <q-btn
          v-if="part.name"
          @click="$emit('addPart')"
          flat
          label="Save"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(["part"]);

const emit = defineEmits(["addPart"]);
</script>
