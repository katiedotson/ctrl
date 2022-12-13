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
          <tr v-for="date in dates">
            <th v-html="getFormattedDate(date)"></th>
            <td
              v-for="habit in habits"
              v-html="getFormattedIcon(habit, date)"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
<script lang="ts">
import { Habit, useHabitsStore } from "@/stores/habits";
import { useCalendarStore } from "@/stores/calendar";
import moment from "moment";
export default {
  mounted() {
    const habitsStore = useHabitsStore();
    this.habits = habitsStore.habits;
    habitsStore.$subscribe((_, state) => {
      this.habits = state.habits;
    });
    const calendarStore = useCalendarStore();
    this.dates = calendarStore.calendar;
  },
  data() {
    return {
      habits: [] as Habit[],
      dates: [] as any[],
    };
  },
  methods: {
    getFormattedDate(date: any): string {
      return moment(date.date).format("ddd MMM D");
    },
    getFormattedIcon(habit: Habit, date: any): string {
      if (date.habitsCompleted.some((it: any) => it == habit.id)) {
        return habit.checkIcon;
      }
      return "";
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
</style>
