<template>
  <div class="q-pa-md">
    <q-card class="bg-primary text-white">
      <q-card-actions>
        <q-btn @click="$router.back()" dense flat icon="arrow_back" label="Back" />
        <q-space />
        Optional Input Fields
        <q-space />
        <q-btn @click="$router.back()" dense rounded icon="add" color="orange" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { useUserStore as store } from "src/stores/user-store";
export default {
  preFetch({ currentRoute, previousRoute, redirect }) {
    const store = store();
    !store?.user && redirect({ path: "/" });
  },
};
</script>

<script setup></script>
