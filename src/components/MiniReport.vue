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
              <b
                >{{ company_data?.name?.toUpperCase() }} :
                <small
                  ><code>(Entries - {{ company_data?.entries?.length }})</code></small
                ></b
              >
            </div>
            <q-separator color="primary" />
            <q-list bordered separator dense>
              <q-item>
                <q-item-section>Total Purchases' cost</q-item-section>
                <q-item-section avatar>
                  {{
                    company_data?.entries?.reduce(
                      (a, b) => a + Number(b.purchases_cost),
                      0
                    )
                  }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Total closing stock cost</q-item-section>
                <q-item-section avatar>
                  {{
                    company_data?.entries?.reduce(
                      (a, b) => a + Number(b.closing_stock_cost),
                      0
                    )
                  }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Total usage cost</q-item-section>
                <q-item-section avatar>
                  {{
                    company_data?.entries?.reduce((a, b) => a + Number(b.usage_cost), 0)
                  }}
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
import { ref } from "vue";
import { useQuery } from "vue-query";
import { fetchData } from "src/utilities/commonMethods";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();
const company_data = ref("");
let totalPurchasesCost = ref(0);
let totalClosingStockCost = ref(0);
let totalUsageCost = ref(0);

const {
  data: companies,
  isLoading: isLoadingCompany,
  isError: isErrorCompany,
} = useQuery("companies", () => fetchData("companies", userStore?.user?.token));
</script>
