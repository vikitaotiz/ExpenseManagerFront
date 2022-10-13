<template>
  <CommonHeader :section_title="'Reports'" />
  <div class="q-pa-md">
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card class="q-pa-md">
          <router-link to="/entries_reports" class="r-links">
            <q-icon name="content_paste" size="sm" class="q-mr-md" />
            Sales</router-link
          >
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card class="q-pa-md">
          <router-link to="/purchases_reports" class="r-links">
            <q-icon name="content_paste" size="sm" class="q-mr-md" />
            Purchases</router-link
          >
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore as store } from "src/stores/user-store";
import CommonHeader from "src/components/CommonHeader.vue";
export default {
  preFetch({ currentRoute, previousRoute, redirect }) {
    const userStore = store();
    !userStore?.user && redirect({ path: "/" });
  },
  components: { CommonHeader },
};
</script>

<style>
.r-links {
  text-decoration: none;
  color: #029e43;
  font-weight: bolder;
}
</style>
