<template>
  <q-dialog>
    <q-card style="width: 400px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Edit {{ selected_category.title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense label="Name" v-model="selected_category.title" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
        <q-space />
        <q-btn
          @click="$emit('editCategory')"
          flat
          label="Save"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(["selected_category"]);

const emit = defineEmits(["editCategory"]);
</script>
