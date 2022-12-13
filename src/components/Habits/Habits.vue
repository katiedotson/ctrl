<template>
  <section>
    <h1>Habits</h1>
    <div class="habits-container">
      <div v-for="habit in habits" class="habit-detail">
        <div class="habit-name">{{ habit.name }}</div>
        <div class="habit-check" v-html="habit.checkIcon"></div>
        <div class="habit-check" v-html="habit.checkIcon"></div>
        <div class="habit-check" v-html="habit.checkIcon"></div>
        <div class="habit-check" v-html="habit.checkIcon"></div>
        <div class="habit-check" v-html="habit.checkIcon"></div>
        <div class="habit-check" v-html="habit.checkIcon"></div>
        <div class="habit-check" v-html="habit.checkIcon"></div>
        <div class="habit-check" v-html="habit.checkIcon"></div>
        <div class="habit-check" v-html="habit.checkIcon"></div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { Habit, useHabitsStore } from "@/stores/habits";
export default {
  mounted() {
    const habitsStore = useHabitsStore();
    this.habits = habitsStore.habits;
    habitsStore.$subscribe((_, state) => {
      this.habits = state.habits;
    });
  },
  data() {
    return {
      habits: [] as Habit[],
    };
  },
};
</script>
<style scoped>
.habits-container {
  scroll-behavior: smooth;
  overflow-y: hidden;
  overflow-x: scroll;
}
.habit-detail {
  display: flex;
}
.habit-detail > div {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 20px;
  font-size: 1rem;
  background-color: var(--color-background-soft);
}
.habit-detail > div.habit-check {
  text-align: center;
}
.habit-detail > div.habit-name {
  width: 180px;
}
</style>
