<template>
  <div style="width: 400px">
    <q-btn-group spread unelevated>
      <q-btn to="/" unelevated color="primary" label="Login" icon="person" />
      <q-btn to="/register" unelevated color="primary" label="Register" icon="edit" />
    </q-btn-group>
    <div class="box">
      <q-select
        dense
        outlined
        v-model="country"
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
          v-model="phoneNumber"
          label="Enter your phone..."
        >
          <template v-slot:prepend>
            <code style="color: #029e43; font-size: 15px; padding-top: 11px">{{
              country?.dial_code
            }}</code>
          </template>
        </q-input>
        <small style="color: red"> {{ phoneError }}</small>
      </div>
      <q-input
        dense
        outlined
        v-model="user.name"
        label="Enter your name"
        class="q-mb-md"
      />

      <q-input
        dense
        outlined
        v-model="user.email"
        label="Enter your email..."
        type="email"
        class="q-mb-md"
      />
      <q-input
        dense
        outlined
        v-model="user.password"
        label="Enter your password..."
        type="password"
        class="q-mb-md"
      />

      <div style="text-align: center">
        <q-spinner-grid v-if="loading" size="40px" color="primary" label="Loading..." />
      </div>

      <q-btn
        v-if="!loading && country"
        @click="register"
        class="full-width"
        color="primary"
        label="Register"
        rounded
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useUserStore } from "src/stores/user-store.js";
import { useRouter } from "vue-router";
import { countries } from "src/utilities/countries";

import {
  validatePhone,
  filterCountries,
  combineCodeNumber,
} from "src/utilities/commonMethods";
import { useQuasar } from "quasar";

const router = useRouter();
const $q = useQuasar();

const country_data = countries();
const options = ref(country_data);
const country = ref(null);
const phoneError = ref("");
const loading = ref(false);

const user = reactive({
  name: "",
  email: "",
  password: "",
});
const phoneNumber = ref("");

const userStore = useUserStore();

const register = async () => {
  let phone = null;

  if (!validatePhone(phoneNumber.value)) phoneError.value = "The number is invalid.";
  else if (country.value && phoneNumber.value && user.name && user.password) {
    phoneError.value = "";
    loading.value = true;

    phone = combineCodeNumber(phoneNumber, country);

    let data = {
      phone: phone,
      name: user.name,
      country: country.value.name,
      email: user.email,
      password: user.password,
    };

    const res = await userStore.loginRegister(data, "register");

    if (res.status === 201) {
      router.push("/dashboard");
      loading.value = false;
      $q.notify({
        message: "Registration successfully.",
        color: "orange",
        position: "top-right",
      });
    } else {
      loading.value = false;
      alert("There was an error!");
    }
  } else {
    alert("Country, Phone, Name and Password are required!");
  }
};

const filterFn = (val, update) => filterCountries(val, update, options, country_data);
</script>

<style>
.box {
  border: 1px solid rgb(196, 194, 194);
  padding: 20px;
  /* border-radius: 0 9px 0 9px; */
  margin-top: 5%;
  background: white;
}
</style>
