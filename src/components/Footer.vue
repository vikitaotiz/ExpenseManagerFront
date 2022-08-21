<template>
  <q-footer reveal>
    <q-tabs dense indicator-color="yellow">
      <q-route-tab
        v-for="link in links"
        :key="link.text"
        :icon="link.icon"
        :to="link.to"
        v-on="link.text === 'Entries' ? { click: () => readEntries() } : {}"
        >{{ link.text
        }}<q-badge
          v-if="link.text === 'Entries' && entryStore.today_entries > 0"
          color="red"
          floating
          >{{ entryStore.today_entries }}+</q-badge
        ></q-route-tab
      >
    </q-tabs>
  </q-footer>
</template>

<script setup>
import { ref } from "vue";
import { useEntryStore } from "src/stores/entry-store";
import { app_links } from "src/utilities/appLinks";

const entryStore = useEntryStore();
const links = ref(app_links);

const readEntries = () => entryStore.clearEntry();
</script>
