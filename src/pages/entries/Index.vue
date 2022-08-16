<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred</div>

    <q-table
      v-else
      grid
      title="Companies/Businesses with entries"
      :rows="data"
      row-key="title"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
    >
      <template v-slot:top-right>
        <q-btn
          label="View All Composition"
          size="sm"
          flat
          color="primary"
          to="/companies"
          class="q-mr-md"
        />
        <q-input
          v-if="data?.length > 1"
          borderless
          dense
          outlined
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
          :to="`/company_entries/${props.row.slug}`"
          class="q-pa-xs col-xs-12 col-sm-6 col-md-3"
          style="text-decoration: none"
        >
          <q-card style="cursor: pointer" class="mycard">
            <q-card-section class="text-center">
              <b>{{ props.row.name.toUpperCase() }}</b>
            </q-card-section>
            <q-separator color="orange" />
            <q-card-section>
              <small
                ><b>Entries : {{ props.row.entry_count }}</b></small
              >
            </q-card-section>
          </q-card>
        </router-link>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuery } from "vue-query";
import { fetchData } from "src/utilities/commonMethods";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

const filter = ref("");

const { data, isLoading, isError } = useQuery("company_entries", () =>
  fetchData("company_entries", userStore?.user?.token)
);
</script>

<style>
.mycard {
  text-decoration: none;
  background: #029e43;
  color: white;
}

.mycard:hover {
  background: #fff;
  color: #029e43;
}
</style>
