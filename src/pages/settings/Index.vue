<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/categories" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="list" />

            Categories
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <q-icon size="sm" class="q-mr-md" color="primary" name="local_grocery_store" />

          <router-link to="/all_products" class="setting_links">
            All Products
          </router-link></q-card
        >
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/users" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="group" />

            Users
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <q-icon size="sm" class="q-mr-md" color="primary" name="lock_open" />

          <router-link to="/roles" class="setting_links"> Roles </router-link></q-card
        >
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/companies" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="location_city" />

            Companies
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <q-icon size="sm" class="q-mr-md" color="primary" name="trending_up" />

          <router-link to="/parts" class="setting_links"> Parts </router-link></q-card
        >
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/units" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="trending_up" />

            Measurement Units
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md bg-blue">
          <q-icon size="sm" class="q-mr-md" color="white" name="content_paste" />

          <router-link to="/reports" class="setting_links" style="color: white">
            Reports
          </router-link></q-card
        >
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/company_stores" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="location_city" />

            Company Stores
          </router-link></q-card
        >
      </div>
    </div>
  </div>
</template>

<style>
.setting_links {
  text-decoration: none;
  font-weight: bolder;
  color: #029e43;
}
</style>
