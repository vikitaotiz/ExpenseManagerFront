<template>
  <CommonHeader :section_title="'Settings'" />

  <div class="q-pa-md">
    <div class="row">
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/categories" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="list" />

            Categories
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <q-icon size="sm" class="q-mr-md" color="primary" name="local_grocery_store" />

          <router-link to="/all_products" class="setting_links">
            All Products
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/users" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="group" />

            Users
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <q-icon size="sm" class="q-mr-md" color="primary" name="lock_open" />

          <router-link to="/roles" class="setting_links"> Roles </router-link></q-card
        >
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/companies" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="location_city" />

            Companies
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <q-icon size="sm" class="q-mr-md" color="primary" name="trending_up" />

          <router-link to="/parts" class="setting_links"> Parts </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/units" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="trending_up" />

            Measurement Units
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md bg-blue">
          <q-icon size="sm" class="q-mr-md" color="white" name="content_paste" />

          <router-link to="/reports" class="setting_links" style="color: white">
            Reports
          </router-link></q-card
        >
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/company_stores" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="location_city" />

            Company Stores
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/optional_input" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="location_city" />

            Optional Input
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/ingredients" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="location_city" />

            Raw materials
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/purchases" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="location_city" />

            Purchases
          </router-link></q-card
        >
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/suppliers" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="location_city" />

            Suppliers
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <q-icon size="sm" class="q-mr-md" color="primary" name="lock_open" />

          <router-link to="/tags" class="setting_links"> Tags </router-link></q-card
        >
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
.setting_links {
  text-decoration: none;
  font-weight: bolder;
  color: #029e43;
}
</style>
