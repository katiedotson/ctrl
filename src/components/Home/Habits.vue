<script setup lang="ts">
import HabitBox from "@/components/Home/HabitBox.vue"
</script>
<template>
  <div id="habits-box">
    <h1 @click="habitsClicked">Habits<span>&nbsp;&rarr;</span></h1>
    <div v-if="habits != undefined && habits.length != 0" id="habits-container">
      <HabitBox v-for="habit in habits" :habitProp="habit" :currentDay="currentDay" v-bind:key="habit.id" />
    </div>
    <div v-if="habits == undefined || habits.length == 0">Nothing here yet.</div>
  </div>
</template>
<script lang="ts">
import { useHabitsStore } from "@/stores/habits"
import { useHabitCalendarStore } from "@/stores/habit-calendar"
import type { HabitDay, Habit } from "@/types/types"
export default {
  data() {
    return {
      habits: [] as Habit[],
      currentDay: {} as HabitDay,
    }
  },
  mounted() {
    // habits
    const habitsStore = useHabitsStore()
    this.habits = habitsStore.habits
    habitsStore.$subscribe((_, state) => {
      this.habits = state.habits
    })

    // calendar and today
    const calendarStore = useHabitCalendarStore()
    this.currentDay = calendarStore.currentDay
    calendarStore.$subscribe((_, state) => {
      this.currentDay = state.currentDay
    })
  },
  methods: {
    habitsClicked() {
      this.$emit("habitsClicked")
    },
  },
}
</script>
<style scoped>
h1 {
  margin-top: 1em;
  font-size: 1.5rem;
  cursor: pointer;
  width: fit-content;
}
h1:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
#habits-box {
  color: var(--color-heading);
}
#habits-container {
  margin: 8px 0;
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
