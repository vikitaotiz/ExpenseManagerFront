<template>
  <q-dialog>
    <q-card>
      <q-card-section>
        <div class="text-h6">Edit {{ category.title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense label="Title" v-model="category.title" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
        <q-btn flat label="Save" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(["category"]);
</script>
