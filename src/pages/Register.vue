<template>
  <q-page class="flex flex-center">
    <Register />
  </q-page>
</template>

<script>
import { useUserStore as store } from "src/stores/user-store";
export default {
  preFetch({ currentRoute, previousRoute, redirect }) {
    const userStore = store();
    userStore?.user && redirect({ path: "/dashboard" });
  },
};
</script>

<script setup>
import Register from "src/components/Register.vue";
</script>
