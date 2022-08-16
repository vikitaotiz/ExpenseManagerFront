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

        <q-toolbar-title> Expense Manager </q-toolbar-title>

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

    <Footer />
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import MenuLink from "components/MenuLink.vue";
import { useUserStore } from "src/stores/user-store.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import MiniProfile from "src/components/MiniProfile.vue";
import Footer from "src/components/Footer.vue";

const $q = useQuasar();

const userStore = useUserStore();
const router = useRouter();

const loading = ref(false);
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value);

const logout = async () => {
  loading.value = true;
  const res = await userStore.logout();

  if (res.status === 200) {
    router.push("/");
    loading.value = false;
    $q.notify({
      message: "Logged out successfully.",
      color: "orange",
      position: "top-right",
    });
  } else {
    alert("There was an error.");
    loading.value = false;
  }
};
</script>

<style>
@media screen and (min-width: 768px) {
  .q-footer {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .menuBtn {
    display: none;
  }
}
</style>
