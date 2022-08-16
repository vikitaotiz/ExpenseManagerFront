<template>
  <q-list separator class="q-pt-md">
    <q-item v-for="link in links" :key="link.text" clickable v-ripple :to="link.to">
      <q-item-section avatar>
        <q-icon color="primary" :name="link.icon" />
      </q-item-section>

      <q-item-section
        ><b>{{ link.text }}</b></q-item-section
      >
    </q-item>
  </q-list>
</template>

<script setup>
import { app_links } from "src/utilities/appLinks";
import { ref } from "vue";

const links = ref(app_links);
</script>
