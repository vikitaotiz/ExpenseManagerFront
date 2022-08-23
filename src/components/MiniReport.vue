<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-4 q-pa-sm">
        <q-card flat class="q-pa-sm">
          <div v-if="isLoadingCompany">Loading...</div>
          <div v-if="isErrorCompany">There was an error</div>
          <div v-if="companies">
            Select Company
            <q-select
              outlined
              v-model="company_data"
              :options="companies"
              option-label="name"
              dense
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="location_city" />
              </template>
            </q-select>
          </div>
        </q-card>
      </div>

      <div v-if="company_data" class="col-xs-12 col-sm-8 col-md-8">
        <div class="col-4 q-pa-sm">
          <q-card flat class="q-pa-sm">
            <div class="text-center">
              <b v-if="company_data?.entries?.length > 0">
                <router-link :to="`/company_entries/${company_data?.slug}`">{{
                  company_data?.name?.toUpperCase()
                }}</router-link>
                :
                <small
                  ><code>(Entries - {{ company_data?.entries?.length }})</code></small
                ></b
              >
              <b v-else
                >{{ company_data?.name?.toUpperCase() }}:
                <small
                  ><code>(Entries - {{ company_data?.entries?.length }})</code></small
                ></b
              >
            </div>
            <q-separator color="primary" />
            <q-list v-if="company_data?.entries?.length > 0" bordered separator dense>
              <q-item>
                <q-item-section>Total Production Cost</q-item-section>
                <q-item-section avatar>
                  {{ computedTotalProductionCost }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Total Usage/Sales cost</q-item-section>
                <q-item-section avatar>
                  {{ computedTotalUsageCost }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Net profit</q-item-section>
                <q-item-section avatar>
                  {{ computedProfit }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Percentage profit</q-item-section>
                <q-item-section avatar>
                  {{
                    computedProfit / computedTotalProductionCost
                      ? ((computedProfit / computedTotalProductionCost) * 100).toFixed(2)
                      : 0
                  }}
                  %
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useQuery } from "vue-query";
import { fetchData } from "src/utilities/commonMethods";

const company_data = ref("");

const {
  data: companies,
  isLoading: isLoadingCompany,
  isError: isErrorCompany,
} = useQuery("companies", () => fetchData("companies"));

const computedTotalProductionCost = computed(() => {
  return company_data.value?.entries?.reduce(
    (a, b) => a + Number(b.unit_price) * Number(b.usage),
    0
  );
});

const computedTotalUsageCost = computed(() => {
  return company_data.value?.entries?.reduce(
    (a, b) => a + Number(b.selling_price) * Number(b.usage),
    0
  );
});

const computedProfit = computed(() => {
  const buying_price = company_data.value?.entries?.reduce(
    (a, b) => a + Number(b.unit_price) * Number(b.usage),
    0
  );

  const selling_price = company_data.value?.entries?.reduce(
    (a, b) => a + Number(b.selling_price) * Number(b.usage),
    0
  );

  return selling_price - buying_price;
});
</script>
