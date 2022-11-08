<template>
  <q-dialog persistent>
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section class="row items-center">
        <span class="q-ml-sm"
          ><b>{{ tag.form_title }}</b></span
        >
      </q-card-section>
      <q-separator color="orange" />
      <q-card-section>
        <q-input outlined dense v-model="tag.name" label="Name" />
        <small style="color: red">{{ tag.errorMessage }}</small>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
        <q-space />
        <q-btn
          v-if="tag.name"
          @click="$emit('addTag')"
          flat
          label="Save"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(["tag"]);

const emit = defineEmits(["addTag"]);
</script>
