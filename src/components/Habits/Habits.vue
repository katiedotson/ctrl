<script setup lang="ts">
import Modal from "../Modal/Modal.vue"
import EditHabitDay from "./EditHabitDay.vue"
import HabitsTable from "./HabitsTable.vue"
</script>
<template>
  <section>
    <h1>Habits</h1>
    <habits-table :habits="habits" :days="days" @day-clicked="dayClicked" />
    <div>
      <h2>Week of: {{ getStartDateFormatted() }}</h2>
      <div class="button-container">
        <button @click="changeWeek(-1)">&larr;</button>
        <button @click="changeWeek(1)">&rarr;</button>
      </div>
    </div>
    <Modal v-if="dateModalDay" @close-modal="closeDateModal">
      <template v-slot:title> Edit Day </template>
      <template v-slot:content>
        <EditHabitDay :habits="habits" :day="dateModalDay" />
      </template>
    </Modal>
  </section>
</template>
<script lang="ts">
import { Habit, useHabitsStore } from "@/stores/habits"
import { AppDay, useCalendarStore } from "@/stores/calendar"
import { DateTime } from "luxon"
export default {
  mounted() {
    // habits
    const habitsStore = useHabitsStore()
    this.habits = habitsStore.habits
    habitsStore.$subscribe((_, state) => {
      this.habits = state.habits
    })

    // calendar
    const calendarStore = useCalendarStore()
    this.days = calendarStore.calendar
    calendarStore.$subscribe(
      (_, state) => {
        this.days = state.calendar
      },
      { detached: true }
    )

    // start date
    this.startDate = calendarStore.startDate
    calendarStore.$subscribe((_, state) => {
      this.startDate = state.startDate
    })
  },
  data() {
    return {
      habits: [] as Habit[],
      days: [] as AppDay[],
      dateModalDay: undefined as AppDay | undefined,
      startDate: undefined as Date | undefined,
    }
  },
  methods: {
    closeDateModal() {
      this.dateModalDay = undefined
    },
    getStartDateFormatted(): string {
      return DateTime.fromJSDate(this.startDate!!).toFormat("DDDD")
    },
    changeWeek(increment: number) {
      const calendarStore = useCalendarStore()
      calendarStore.changeStartDate(increment)
    },
    dayClicked(day: AppDay) {
      this.dateModalDay = day
    },
  },
}
</script>
<style scoped>
.date {
  cursor: pointer;
}
.date:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
button {
  background: none;
  color: var(--color-text);
  border: none;
  cursor: pointer;
  font-size: 3rem;
}
button:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
.button-container button:last-child {
  float: right;
}
</style>
