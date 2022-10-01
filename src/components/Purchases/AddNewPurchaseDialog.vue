<template>
  <q-dialog persistent>
    <q-card style="width: 600px; max-width: 80vw">
      <q-card-section class="row items-center">
        <span class="q-ml-sm"
          ><b>{{ purchase.form_title }}</b></span
        >
      </q-card-section>
      <q-separator color="orange" />
      <q-card-section>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-select
              :disable="edit_purchase"
              dense
              outlined
              v-model="purchase.supplier_id"
              use-input
              input-debounce="0"
              label="Select Supplier"
              :options="options4"
              option-label="name"
              @filter="filterFn4"
              class="q-mb-md"
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No results </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-select
              :disable="edit_purchase"
              dense
              outlined
              v-model="purchase.product"
              use-input
              input-debounce="0"
              label="Select Product"
              :options="options1"
              option-label="name"
              @filter="filterFn1"
              class="q-mb-md"
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No results </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-input
              type="number"
              outlined
              dense
              v-model="purchase.quantity"
              label="Quantity Purchased"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-select
              dense
              outlined
              v-model="purchase.measurement"
              label="Select Measurement"
              option-label="title"
              class="q-mb-md"
              use-input
              input-debounce="0"
              :options="options2"
              @filter="filterFn2"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No results </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-input
              type="number"
              outlined
              dense
              v-model="purchase.issued"
              label="Issued Quantity"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-input
              type="number"
              outlined
              dense
              v-model="purchase.opening_stock"
              label="Opening stock"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-input
              type="number"
              outlined
              dense
              v-model="purchase.closing_stock"
              label="Closing Stock"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-input
              type="number"
              outlined
              dense
              v-model="purchase.actual_stock"
              label="Actual Stock"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-input
              type="number"
              outlined
              dense
              v-model="purchase.total_amount"
              label="Total amount"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-card flat bordered class="q-pa-sm"
              >Unit price : {{ price_per_unit }}</q-card
            >
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-select
              dense
              outlined
              v-model="purchase.payment_mode_id"
              use-input
              input-debounce="0"
              label="Select Payment Mode"
              :options="options3"
              option-label="name"
              @filter="filterFn3"
              class="q-mb-md"
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No results </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 q-mb-sm q-pa-sm">
            <q-input
              type="number"
              outlined
              dense
              v-model="purchase.balance"
              label="Balance"
            />
          </div>
        </div>
        <small style="color: red">{{ purchase.errorMessage }}</small>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          @click="$emit('resetForm')"
          flat
          label="Cancel"
          color="red"
          v-close-popup
        />
        <q-space />
        <q-btn @click="$emit('addPurchase')" flat label="Save" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import { filterData, filterData2 } from "src/utilities/commonMethods";

const props = defineProps([
  "purchase",
  "ingredients",
  "units",
  "suppliers",
  "payment_modes",
  "edit_purchase",
]);

const emit = defineEmits(["addPurchase", "resetForm"]);

const options1 = ref(props.ingredients);
const options2 = ref(props.units);
const options3 = ref(props.payment_modes);
const options4 = ref(props.suppliers);

const filterFn1 = (val, update) => filterData(val, update, options1, props.ingredients);
const filterFn2 = (val, update) => filterData2(val, update, options2, props.units);
const filterFn3 = (val, update) => filterData(val, update, options3, props.payment_modes);
const filterFn4 = (val, update) => filterData(val, update, options4, props.suppliers);

const price_per_unit = computed(() => {
  const result =
    props.purchase?.total_amount && props.purchase?.quantity
      ? (Number(props.purchase?.total_amount) / Number(props.purchase?.quantity)).toFixed(
          2
        )
      : 0;
  props.purchase.unit_price = result;
  return result;
});
</script>
