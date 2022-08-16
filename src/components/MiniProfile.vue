<template>
  <div>
    <b class="q-mb-sm" style="color: #029e43">Profile Summary</b
    ><q-separator color="primary" />
    <small>
      <ul>
        <li>
          <b>Phone : {{ userStore?.user?.user?.phone }}</b>
        </li>
        <li>
          <b>Email : {{ userStore?.user?.user?.email }}</b>
        </li>
        <li>
          <b>Role : {{ userStore?.user?.user?.role }}</b>
        </li>
        <li>
          <b>Company : {{ userStore?.user?.user?.company }}</b>
        </li>
        <li>
          <b>Country : {{ userStore?.user?.user?.country }}</b>
        </li>
      </ul>
    </small>
    <div class="q-mt-md">
      <b style="color: #029e43"><q-icon size="sm" name="location_city" /> About The App</b
      ><q-separator color="primary" />
      <small
        >The app is used in auditing <br />
        cost of production in a business.<br /><b>Expense Manager</b> &copy;
        {{ new Date().getFullYear() }}</small
      >
    </div>
  </div>
</template>

<script setup>
defineProps(["userStore"]);
</script>
