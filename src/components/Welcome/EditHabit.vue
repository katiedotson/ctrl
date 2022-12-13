<template>
  <h1>{{ habitProp.name }}</h1>
</template>
<script>
import { useHabitsStore, Habit } from "@/stores/habits";
export default {
  props: {
    habitProp: Habit,
  },
};
</script>
<style scoped>
h1 {
  width: 50px;
}
</style>
