<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>
<script lang="ts">
import { useCalendarStore } from "./stores/calendar";
export default {
  beforeCreate() {
    const calendarStore = useCalendarStore();
    calendarStore.initialize();
    import { initializeApp } from "firebase/app";

    const firebaseConfig = {};

    const app = initializeApp(firebaseConfig);
  },
};
</script>
