<template>
  <div>
    <q-card flat class="bg-orange text-white q-ma-sm">
      <q-card-actions>
        <div>Product Categories</div>
        <q-space />
        <q-input
          outlined
          borderless
          dense
          rounded
          debounce="300"
          v-model="filter"
          placeholder="Search"
          class="q-mr-md"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-actions>
    </q-card>

    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred</div>

    <q-table
      v-else
      grid
      :rows="categories"
      row-key="title"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
    >
      <q-separator />

      <template v-slot:item="props">
        <router-link
          :to="`/costing_category_products/${props.row.slug}`"
          class="q-pa-sm col-xs-12 col-sm-6 col-md-3"
          style="text-decoration: none; color: #029e43"
        >
          <q-card style="cursor: pointer; border-radius: 10px">
            <q-card-actions align="around" class="q-pa-md">
              <b
                ><q-icon name="check" size="sm" class="q-mr-md" />
                {{ props.row.title.toUpperCase() }}</b
              >
              <q-space />
              <small class="text-blue"><b>Products </b>: {{ props.row.products }}</small>
            </q-card-actions>
          </q-card>
        </router-link>
      </template>
    </q-table>
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

<script setup>
import { ref } from "vue";
import { useQuery } from "vue-query";

import { fetchData } from "src/utilities/commonMethods";
import { util_pagination } from "src/utilities/util_pagination";

const filter = ref("");
const loading = ref(false);

const pagination = ref(util_pagination(10));

const { data: categories, isLoading, isError } = useQuery("categories", () =>
  fetchData("categories")
);
</script>
