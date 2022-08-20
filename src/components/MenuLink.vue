<template>
  <q-list separator class="q-mt-md">
    <q-item
      v-for="link in links"
      :key="link.text"
      clickable
      v-ripple
      :to="link.to"
      v-on="link.text === 'Entries' ? { click: () => readEntries() } : {}"
    >
      <q-item-section avatar>
        <q-icon color="primary" :name="link.icon" />
      </q-item-section>

      <q-item-section
        ><b>{{ link.text }}</b
        ><q-badge
          v-if="link.text === 'Entries' && entryStore.today_entries > 0"
          color="red"
          floating
          >{{ entryStore.today_entries }}+</q-badge
        ></q-item-section
      >
    </q-item>
    <q-separator />
  </q-list>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useEntryStore } from "src/stores/entry-store";
import { app_links } from "src/utilities/appLinks";
import { useUserStore } from "src/stores/user-store";

const entryStore = useEntryStore();
const links = ref(app_links);
const userStore = useUserStore();

const readEntries = () => entryStore.clearEntry();
</script>
