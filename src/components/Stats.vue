<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred</div>

    <q-card flat class="q-pa-md q-mb-md text-center">
      <b
        ><router-link to="/entries" class="links"
          >All Entries: {{ stats?.all_entries }}</router-link
        ></b
      ></q-card
    >
    <q-card flat class="q-pa-md q-mb-md text-center">
      <b
        ><router-link to="/costings" class="links"
          >Today's Entries: {{ stats?.today_entries }}</router-link
        ></b
      >
    </q-card>
    <q-card flat class="q-pa-md q-mb-md text-center">
      <b
        ><router-link to="/categories" class="links"
          >Categories: {{ stats?.categories }}</router-link
        ></b
      >
    </q-card>
    <q-card flat class="q-pa-md q-mb-md text-center">
      <b
        ><router-link to="/all_products" class="links">
          Products: {{ stats?.products }}</router-link
        ></b
      >
    </q-card>
    <q-card flat class="q-pa-md q-mb-md text-center">
      <b
        ><router-link to="/companies" class="links"
          >Companies: {{ stats?.companies }}</router-link
        ></b
      >
    </q-card>
    <q-card flat class="q-pa-md text-center">
      <b
        ><router-link to="/users" class="links">Users: {{ stats?.users }}</router-link></b
      >
    </q-card>
  </div>
</template>
<script setup>
import { reactive } from "vue";
import { useQuery } from "vue-query";
import { useUserStore } from "src/stores/user-store";
import { fetchData } from "src/utilities/commonMethods";

const userStore = useUserStore();

const stats = reactive({
  all_entries: 0,
  today_entries: 0,
  categories: 0,
  products: 0,
  companies: 0,
  users: 0,
});

const { isLoading, isError } = useQuery(
  "entries",
  () => fetchData("stats", userStore?.user?.token),
  {
    onSuccess: (data) => {
      stats.all_entries = data.all_entries;
      stats.today_entries = data.today_entries;
      stats.categories = data.categories;
      stats.products = data.products;
      stats.companies = data.companies;
      stats.users = data.users;
    },
  }
);
</script>

<style>
.myColor {
  color: #029e43;
}

.links {
  text-decoration: none;
  color: #029e43;
}
</style>
