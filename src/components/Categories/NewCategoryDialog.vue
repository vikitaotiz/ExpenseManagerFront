<template>
  <q-dialog persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section> <div class="text-h6">Add New Category</div> </q-card-section
      ><q-separator class="q-mb-sm" />

      <q-card-section class="q-pt-none">
        <q-input
          dense
          outlined
          v-model="category.title"
          label="Category name..."
          type="text"
          class="q-mb-md"
        />
        <q-input
          v-model="category.description"
          outlined
          type="textarea"
          label="Category description (optional)..."
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
        <q-space />
        <q-btn
          v-if="category.title"
          @click="$emit('addCategory')"
          flat
          label="Add"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(["category"]);

const emit = defineEmits(["addCategory"]);
</script>
