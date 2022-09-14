<template>
  <CommonHeader :section_title="'Purchases'" />
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/today_purchases" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="location_city" />

            Today Purchases : Ksh {{ computedTodayTotal }}
          </router-link></q-card
        >
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
        <q-card flat class="q-pa-md">
          <router-link to="/all_purchases" class="setting_links">
            <q-icon size="sm" class="q-mr-md" color="primary" name="location_city" />

            All Purchases : Ksh {{ computedAllTotal }}
          </router-link></q-card
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import CommonHeader from "src/components/CommonHeader.vue";
import { fetchData } from "src/utilities/commonMethods";
import { computed, ref } from "vue";
import { useQuery } from "vue-query";

const today_data = ref([]);
useQuery("today_purchases", () => fetchData("today_purchases"), {
  onSuccess: (data) => (today_data.value = data),
});

const computedTodayTotal = computed(() =>
  today_data.value.reduce((a, b) => a + Number(b.total_amount), 0)
);

const all_data = ref([]);
useQuery("all_purchases", () => fetchData("all_purchases"), {
  onSuccess: (data) => (all_data.value = data),
});

const computedAllTotal = computed(() =>
  all_data.value.reduce((a, b) => a + Number(b.total_amount), 0)
);
</script>
