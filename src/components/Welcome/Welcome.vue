<script setup lang="ts">
import Habits from "./Habits.vue";
import Time from "./Time.vue";
</script>

<template>
  <Habits :habits="habits" />
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
      habits: [
        { name: "thing", isChecked: false },
        { name: "other", isChecked: true },
        { name: "other", isChecked: true },
        { name: "other", isChecked: false },
      ],
      currentTime: Date.now(),
    };
  },
};
</script>
