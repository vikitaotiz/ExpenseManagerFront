<template>
  <q-layout view="hHh lpR lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="userStore.user"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="menuBtn"
        />

        <q-toolbar-title>
          <span class="symb1">Expense Manager</span> <span class="symb2"><b>EXP</b></span>
        </q-toolbar-title>

        <div>
          <span v-if="!userStore.user"> version 0.1.1 </span>
          <q-spinner-grid v-if="loading" size="20px" class="q-mr-md" />

          <q-btn-dropdown icon="person" v-if="userStore.user" unelevated label="Account">
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <MiniProfile :userStore="userStore" />
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <q-icon name="person" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">
                  {{ userStore?.user?.user?.name }}
                </div>

                <q-btn
                  @click="logout"
                  flat
                  dense
                  unelevated
                  color="primary"
                  icon="logout"
                  label="Logout"
                />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="userStore.user"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="170"
      style="position: fixed"
      :breakpoint="768"
    >
      <q-list>
        <MenuLink />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <Footer v-if="userStore.user" />
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useMutation } from "vue-query";

import MenuLink from "components/MenuLink.vue";
import { useUserStore } from "src/stores/user-store.js";
import MiniProfile from "src/components/MiniProfile.vue";
import Footer from "src/components/Footer.vue";
import { notifyUser } from "src/utilities/commonMethods";

const $q = useQuasar();
const userStore = useUserStore();
const router = useRouter();

const loading = ref(false);
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value);

const logout = async () => {
  logoutFn();
  loading.value = true;
};

const { mutate: logoutFn } = useMutation(() => userStore.logout(), {
  onSuccess: (data) => {
    if (data.status === "success") {
      loading.value = false;
      notifyUser($q, data.message, "top-right", "orange");
      router.push("/");
    }

    if (data.status === "error") {
      loading.value = false;
      notifyUser($q, data.message, "top-right", "red");
    }
  },

  onError: (error) => {
    loading.value = false;
    notifyUser($q, `There was an error: ${error}`, "top-right", "red");
  },
});
</script>

<style>
.symb2 {
  display: none;
}
@media screen and (min-width: 768px) {
  .q-footer {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .menuBtn {
    display: none;
  }
  .symb1 {
    display: none;
  }
  .symb2 {
    display: block;
  }
}
</style>
