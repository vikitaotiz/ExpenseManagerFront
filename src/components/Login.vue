<template>
  <div style="width: 400px">
    <q-btn-group spread unelevated>
      <q-btn to="/" unelevated color="primary" label="Login" icon="person" />
      <q-btn to="/register" unelevated color="primary" label="Register" icon="edit" />
    </q-btn-group>
    <div class="box">
      <PhoneInput :user="user" />
      <q-input
        dense
        outlined
        v-model="user.password"
        label="Enter your password..."
        type="password"
        class="q-mb-md"
      />

      <small style="color: red">{{ errorMessage }}</small>

      <div style="text-align: center">
        <q-spinner-grid v-if="loading" size="40px" color="primary" label="Loading..." />
      </div>

      <q-btn
        v-if="!loading && user.country"
        @click="login"
        class="full-width"
        color="primary"
        label="Login"
        rounded
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useMutation } from "vue-query";

import { useUserStore } from "src/stores/user-store.js";
import PhoneInput from "src/components/PhoneInput.vue";
import {
  validatePhone,
  combineCodeNumber,
  notifyUser,
} from "src/utilities/commonMethods";
import { storageId } from "src/utilities/constants";

const router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();

const errorMessage = ref("");
const loading = ref(false);
const user = reactive({
  phoneNumber: "0714581597",
  password: "password",
  country: null,
  phoneError: "",
});

const login = async () => {
  let phone = null;

  if (!validatePhone(user.phoneNumber)) user.phoneError = "The number is invalid.";
  else if (user.country && user.phoneNumber && user.password) {
    user.phoneError = "";

    phone = combineCodeNumber(user.phoneNumber, user.country.dial_code);

    let data = {
      country: user.country.name,
      phone: phone.replace(/\s/g, ""),
      password: user.password,
    };

    loginFn(data);
    loading.value = true;
  } else {
    alert("Country, Phone and Password are required!");
  }
};
const { mutate: loginFn } = useMutation(
  (data) => userStore.loginRegister(data, "login"),
  {
    onSuccess: (data) => {
      if (data.status === "success") {
        const result = {
          token: data.token,
          user: data.user,
        };
        userStore.setUser(result);
        localStorage.setItem(storageId, JSON.stringify(result));
        loading.value = false;
        notifyUser($q, data.message, "top-right", "orange");
        router.push("/dashboard");
      }

      if (data.status === "error") {
        loading.value = false;
        errorMessage.value = data.message;
        notifyUser($q, data.message, "top-right", "red");
      }
    },

    onError: (error) => {
      loading.value = false;
      errorMessage.value = error;
      notifyUser($q, `There was an error: ${error}`, "top-right", "red");
    },
  }
);
</script>

<style>
.box {
  border: 1px solid rgb(196, 194, 194);
  padding: 20px;
  background: white;
}
</style>
