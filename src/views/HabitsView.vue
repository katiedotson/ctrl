<script setup lang="ts">
import Habits from "../components/Habits/Habits.vue";
import BackArrow from "../components/BackArrow/BackArrow.vue";
</script>

<template>
  <main>
    <BackArrow @back-arrow-clicked="navigateBack" />
    <Habits />
  </main>
</template>
<script lang="ts">
export default {
  methods: {
    navigateBack() {
      this.$router.back();
    },
  },
};
</script>
