<script setup lang="ts">
import Habits from "./Habits.vue";
import Time from "./Time.vue";
</script>

<template>
  <Habits />
  <Time :currentTime="currentTime" />
</template>

<script lang="ts">
export default {
  mounted() {
    setInterval(() => {
      this.updateTime();
    }, 1000);
  },
  methods: {
    updateTime() {
      this.currentTime = Date.now();
    },
  },
  data() {
    return {
      currentTime: Date.now(),
    };
  },
};
</script>
