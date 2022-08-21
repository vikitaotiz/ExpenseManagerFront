<template>
  <div class="q-pa-md">
    <div class="text-center">
      <b>ENTRIES</b>
    </div>
    <q-separator />
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card class="q-pa-md">
          <router-link to="/today_entries" class="r-links">
            <q-icon name="content_paste" size="sm" class="q-mr-md" />
            Today</router-link
          >
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card class="q-pa-md">
          <router-link to="/all_entries" class="r-links">
            <q-icon name="content_paste" size="sm" class="q-mr-md" />

            All Entries</router-link
          >
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore as store } from "src/stores/user-store";
export default {
  preFetch({ currentRoute, previousRoute, redirect }) {
    const userStore = store();
    !userStore?.user && redirect({ path: "/" });
  },
};
</script>

<style>
.r-links {
  text-decoration: none;
  color: #029e43;
  font-weight: bolder;
}
</style>
