<template>
  <div class="bg">
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style scoped>
.bg {
  background: #d8dad9;
}
</style>
