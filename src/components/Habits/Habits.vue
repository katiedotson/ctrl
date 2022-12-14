<script setup lang="ts">
import Modal from "../Modal/Modal.vue";
import EditHabitDay from "./EditHabitDay.vue";
</script>
<template>
  <section>
    <h1>Habits</h1>
    <div id="table-scroll" class="table-scroll">
      <table id="main-table">
        <thead>
          <th scope="col"></th>
          <th scope="col" v-for="habit in habits">{{ habit.name }}</th>
        </thead>
        <tbody>
          <tr v-for="day in days">
            <th
              class="date"
              v-html="getFormattedDate(day)"
              @click="dayClicked(day)"
            ></th>
            <td
              v-for="habit in habits"
              v-html="getFormattedIcon(habit, day)"
            ></td>
          </tr>
        </tbody>
      </table>
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
import { Habit, useHabitsStore } from "@/stores/habits";
import { AppDay, useCalendarStore } from "@/stores/calendar";
import moment from "moment";
export default {
  mounted() {
    const habitsStore = useHabitsStore();
    this.habits = habitsStore.habits;
    habitsStore.$subscribe((_, state) => {
      this.habits = state.habits;
    });
    const calendarStore = useCalendarStore();
    this.days = calendarStore.calendar;
    calendarStore.loadCalendar();
    calendarStore.$subscribe(
      (_, state) => {
        this.days = state.calendar;
      },
      { detached: true }
    );
  },
  data() {
    return {
      habits: [] as Habit[],
      days: [] as AppDay[],
      dateModalDay: undefined as AppDay | undefined,
    };
  },
  methods: {
    getFormattedDate(day: AppDay): string {
      return moment(day.date).format("ddd MMM D");
    },
    getFormattedIcon(habit: Habit, date: any): string {
      if (date.habitsCompleted.some((it: any) => it == habit.id)) {
        return habit.checkIcon;
      }
      return "";
    },
    dayClicked(day: AppDay) {
      this.dateModalDay = day;
    },
    closeDateModal() {
      this.dateModalDay = undefined;
    },
  },
};
</script>
<style scoped>
.table-scroll {
  max-height: 80vh;
  position: relative;
  margin: 12px auto;
  overflow: auto;
  background: var(--color-background-soft);
  box-shadow: 5px 10px 8px 10px #00000021;
}
.table-scroll table {
  width: 100%;
  min-width: 600px;
  margin: auto;
  border-spacing: 0;
}
.table-wrap {
  position: relative;
}
.table-scroll th,
.table-scroll td {
  padding: 5px;
  border: none;
  background: var(--color-background-soft);
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.093);
}
.table-scroll thead th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 3;
}
th:first-child {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
  text-align: left;
  padding: 26px 12px;
}
.date {
  cursor: pointer;
}
.date:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
</style>
