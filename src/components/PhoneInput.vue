<template>
  <div>
    <q-select
      dense
      outlined
      v-model="user.country"
      use-input
      input-debounce="0"
      label="Select Country"
      :options="options"
      option-label="name"
      @filter="filterFn"
      class="q-mb-md"
      ><template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>
    <div class="q-mb-md">
      <code style="color: grey">e.g 0XXXXXXXXX - (start with zero)</code>
      <q-input
        dense
        type="tel"
        outlined
        v-model="user.phoneNumber"
        label="Enter your phone..."
      >
        <template v-slot:prepend>
          <code style="color: #029e43; font-size: 15px; padding-top: 11px">{{
            user.country?.dial_code ? user.country?.dial_code : user.dial_code
          }}</code>
        </template>
      </q-input>
      <small style="color: red"> {{ user.phoneError }}</small>
    </div>
  </div>
</template>

<script setup>
import { countries } from "src/utilities/countries";
import { ref } from "vue";
import { filterData } from "src/utilities/commonMethods";

defineProps(["user"]);

const country_data = countries();
const options = ref(country_data);

const filterFn = (val, update) => filterData(val, update, options, country_data);
</script>
