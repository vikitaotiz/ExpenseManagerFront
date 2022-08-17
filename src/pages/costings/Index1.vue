<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred</div>

    <q-table
      v-else
      grid
      title="Product Categories"
      :rows="categories"
      row-key="title"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
    >
      <template v-slot:top-right>
        <q-spinner-grid v-if="loading" class="q-mr-lg" size="30px" color="primary" />

        <q-input
          borderless
          dense
          rounded
          debounce="300"
          v-model="filter"
          placeholder="Search"
          class="q-mr-md"
          autofocus
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <q-separator />

      <template v-slot:item="props">
        <router-link
          :to="`/costing_category_products/${props.row.slug}`"
          class="q-pa-sm col-xs-12 col-sm-6 col-md-3"
          style="text-decoration: none; color: #029e43"
        >
          <q-card style="cursor: pointer; border-radius: 10px">
            <q-card-actions align="around">
              <b><q-icon name="check" /> {{ props.row.title.toUpperCase() }}</b>
              <q-space />
              <small><b>Products </b>: {{ props.row.products }}</small>
            </q-card-actions>
          </q-card>
        </router-link>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuery } from "vue-query";
import { useUserStore } from "src/stores/user-store";
import { fetchData } from "src/utilities/commonMethods";

const userStore = useUserStore();
const filter = ref("");
const loading = ref(false);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

const { data: categories, isLoading, isError } = useQuery("categories", () =>
  fetchData("categories", userStore?.user?.token)
);
</script>
