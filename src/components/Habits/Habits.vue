<script setup lang="ts">
import Modal from "@/components/Modal/Modal.vue"
import EditHabitDay from "@/components/Habits/EditHabitDay.vue"
import HabitsTable from "@/components/Habits/HabitsTable.vue"
import AddHabit from "@/components/Habits/AddHabit.vue"
import EditHabit from "@/components/Habits/EditHabit.vue"
import Datepicker from "@vuepic/vue-datepicker"
</script>
<template>
  <section>
    <h1>Habits</h1>
    <div class="buttons">
      <button @click="addNewHabit">Add a habit</button>
    </div>
    <div v-if="habits.length > 0">
      <habits-table :habits="habits" :days="days" @day-clicked="dayClicked" @habit-clicked="habitClicked" />
      <Datepicker v-model="date" @update:modelValue="handleDateChange" range dark />
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
import { useHabitCalendarStore } from "@/stores/habit-calendar"
import type { HabitDay, Habit } from "@/types/types"
import "@vuepic/vue-datepicker/dist/main.css"
export default {
  mounted() {
    // habits
    const habitsStore = useHabitsStore()
    this.habits = habitsStore.habits
    habitsStore.$subscribe((_, state) => {
      this.habits = state.habits
    })

    // calendar
    const calendarStore = useHabitCalendarStore()
    this.days = calendarStore.calendar
    calendarStore.$subscribe(
      (_, state) => {
        this.days = state.calendar
      },
      { detached: true }
    )

    // start date
    this.date.push(calendarStore.startDate)
    this.date.push(calendarStore.endDate)
    calendarStore.$subscribe((_, state) => {
      this.date = [state.startDate, state.endDate]
    })
  },
  data() {
    return {
      habits: [] as Habit[],
      days: [] as HabitDay[],
      dateModalDay: undefined as HabitDay | undefined,
      date: [] as Date[],
      newHabit: undefined as Habit | undefined,
      editHabit: undefined as Habit | undefined,
    }
  },
  methods: {
    handleDateChange(dates: any) {
      const calendarStore = useHabitCalendarStore()
      calendarStore.changeDateRange(dates[0] as Date, dates[1] as Date)
    },
    closeDateModal() {
      this.dateModalDay = undefined
    },
    dayClicked(day: HabitDay) {
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
</style>
