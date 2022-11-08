<template>
  <div>
    <q-card flat class="bg-orange text-white q-ma-sm">
      <q-card-actions>
        <div>Main Categories</div>
      </q-card-actions>
    </q-card>
  </div>

  <div class="row">
    <router-link
      class="col-xs-12 col-sm-6 col-md-6"
      to="/bar"
      style="text-decoration: none; color: #029e43; text-align: center"
    >
      <q-card flat class="q-pa-md q-ma-sm">BAR</q-card>
    </router-link>

    <router-link
      class="col-xs-12 col-sm-6 col-md-6"
      to="/kitchen"
      style="text-decoration: none; color: #029e43; text-align: center"
    >
      <q-card flat class="q-pa-md q-ma-sm">KITCHEN</q-card>
    </router-link>
  </div>
</template>
