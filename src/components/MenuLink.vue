<template>
  <q-list>
    <q-item clickable v-ripple to="/dashboard">
      <q-item-section avatar>
        <q-icon color="primary" name="dashboard" />
      </q-item-section>

      <q-item-section>Dashoard</q-item-section>
    </q-item>
    <q-separator />
    <q-item clickable v-ripple to="/costings">
      <q-item-section avatar>
        <q-icon color="primary" name="check" />
      </q-item-section>

      <q-item-section>Costings</q-item-section>
    </q-item>
    <q-separator />
    <q-item clickable v-ripple to="/entries">
      <q-item-section avatar>
        <q-icon color="primary" name="ac_unit" />
      </q-item-section>

      <q-item-section>Entries</q-item-section>
    </q-item>
    <q-separator />
    <q-item clickable v-ripple to="/settings">
      <q-item-section avatar>
        <q-icon color="primary" name="settings" />
      </q-item-section>

      <q-item-section>Settings</q-item-section>
    </q-item>
    <q-separator />
  </q-list>
</template>
