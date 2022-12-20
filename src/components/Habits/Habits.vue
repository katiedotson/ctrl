<script setup lang="ts">
import Modal from "../Modal/Modal.vue"
import EditHabitDay from "./EditHabitDay.vue"
import HabitsTable from "./HabitsTable.vue"
import AddHabit from "./AddHabit.vue"
import EditHabit from "./EditHabit.vue"
</script>
<template>
  <section>
    <h1>Habits</h1>
    <div class="buttons">
      <button @click="addNewHabit">Add a habit</button>
    </div>
    <div v-if="habits.length > 0">
      <habits-table :habits="habits" :days="days" @day-clicked="dayClicked" @habit-clicked="habitClicked" />
      <h2>Week of: {{ getStartDateFormatted() }}</h2>
      <div class="button-container">
        <button @click="changeWeek(-1)">&larr;</button>
        <button @click="changeWeek(1)">&rarr;</button>
      </div>
    </div>
    <div v-else>
      <h4>Nothing here yet.</h4>
    </div>
    <!-- Edit day modal -->
    <Modal v-if="dateModalDay" @close-modal="closeDateModal">
      <template v-slot:title> Edit Day </template>
      <template v-slot:content>
        <EditHabitDay :habits="habits" :day="dateModalDay" />
      </template>
    </Modal>
    <!-- Add new habit modal -->
    <Modal v-if="newHabit" @close-modal="closeNewHabitModal">
      <template v-slot:title> Add a new habit </template>
      <template v-slot:content>
        <AddHabit :newHabitProp="newHabit" @save-new-habit="saveNewHabit" />
      </template>
    </Modal>
    <!-- Edit habit modal -->
    <Modal @close-modal="closeHabitModal" v-if="editHabit">
      <template v-slot:title> Edit Habit </template>
      <template v-slot:content>
        <EditHabit :habitProp="editHabit" @modal-closed="closeHabitModal" />
      </template>
    </Modal>
  </section>
</template>
<script lang="ts">
import { useHabitsStore } from "@/stores/habits"
import { useCalendarStore } from "@/stores/calendar"
import { DateTime } from "luxon"
import type { AppDay, Habit } from "@/types/types"
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
      newHabit: undefined as Habit | undefined,
      editHabit: undefined as Habit | undefined,
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
    addNewHabit() {
      this.newHabit = { name: "", id: "", checkIcon: "✅" }
    },
    closeNewHabitModal() {
      this.newHabit = undefined
    },
    saveNewHabit(newHabit: Habit) {
      const habitsStore = useHabitsStore()
      habitsStore.addNewHabit(newHabit)
      this.closeNewHabitModal()
    },
    habitClicked(habit: Habit) {
      this.editHabit = habit
    },
    closeHabitModal() {
      this.editHabit = undefined
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
.button-container button {
  background: none;
  color: var(--color-text);
  border: none;
  cursor: pointer;
  font-size: 3rem;
}
.button-container button:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
.button-container button:last-child {
  float: right;
}
.buttons :last-child {
  margin-left: 0;
}
</style>
