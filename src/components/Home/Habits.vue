<script setup lang="ts">
import HabitBox from "./HabitBox.vue"
</script>
<template>
  <div id="habits-box">
    <h2 @click="habitsClicked">Habits<span>&rarr;</span></h2>
    <div v-if="habits != undefined && habits.length != 0" id="habits-container">
      <HabitBox
        v-for="habit in habits"
        :habitProp="habit"
        :currentDay="currentDay"
        v-bind:key="habit.id"
      />
    </div>
    <div v-if="habits == undefined || habits.length == 0">
      Nothing here yet.
    </div>
  </div>
</template>
<script lang="ts">
import { useHabitsStore, Habit } from "@/stores/habits"
import { useCalendarStore, AppDay } from "@/stores/calendar"
export default {
  data() {
    return {
      habits: [] as Habit[],
      currentDay: {} as AppDay,
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
    const calendarStore = useCalendarStore()
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
h2 {
  margin-top: 1em;
  font-size: 1rem;
  cursor: pointer;
}
h2:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
h2 span {
  display: none;
}
h2:hover span {
  display: inline-block;
  margin-left: 8px;
}
#habits-box {
  color: var(--color-heading);
}
#habits-container {
  margin: 8px 0;
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr;
}
</style>
