<template>
  <q-card class="bg-primary text-white q-ma-md" flat>
    <q-card-actions>
      <q-btn @click="$router.back()" icon="arrow_back" dense flat label="Back" />
      <q-space />
      <b>{{ section_title }}</b>
      <q-space />
    </q-card-actions>
  </q-card>
</template>
<script setup>
defineProps(["section_title"]);
</script>
