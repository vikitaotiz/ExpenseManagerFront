<template>
  <q-footer reveal>
    <q-tabs dense>
      <q-route-tab
        v-for="link in links"
        :key="link.text"
        :icon="link.icon"
        :label="link.text"
        :to="link.to"
      />
    </q-tabs>
  </q-footer>
</template>

<script setup>
import { app_links } from "src/utilities/appLinks";
import { ref } from "vue";

const links = ref(app_links);
</script>
