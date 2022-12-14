<template>
  <div class="table-scroll">
    <table id="main-table">
      <thead>
        <th scope="col" id="empty"></th>
        <th scope="col" v-for="habit in habits" v-bind:key="habit.id" @click="habitTitleClicked(habit)">
          {{ habit.name }}
          <span class="material-icons"> edit </span>
        </th>
      </thead>
      <tbody>
        <tr v-for="day in days" v-bind:key="day.date.getUTCMilliseconds">
          <th @click="dayClicked(day)" v-bind:class="dateIsToday(day)">{{ getFormattedDate(day) }} <span class="material-icons"> edit </span></th>
          <td v-for="habit in habits" v-html="getFormattedIcon(habit, day)" v-bind:key="habit.id" :class="dateIsToday(day)"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { DateTime } from "luxon"
import type { HabitDay, Habit } from "@/types/types"
export default {
  props: {
    habits: {
      type: Array as () => Array<Habit>,
      required: true,
    },
    days: {
      type: Array as () => Array<HabitDay>,
      required: true,
    },
  },
  methods: {
    getFormattedDate(day: HabitDay): string {
      return DateTime.fromJSDate(day.date).toFormat("EEE MMM d")
    },
    getFormattedIcon(habit: Habit, date: any): string {
      if (date.habitsCompleted.some((it: any) => it == habit.id)) {
        return habit.checkIcon
      }
      return ""
    },
    dayClicked(day: HabitDay) {
      this.$emit("dayClicked", day)
    },
    habitTitleClicked(habit: Habit) {
      this.$emit("habitClicked", habit)
    },
    dateIsToday(day: HabitDay): string {
      if (DateTime.fromJSDate(day.date).startOf("day").toMillis() == DateTime.fromJSDate(new Date()).startOf("day").toMillis()) return "today"
      else return ""
    },
  },
}
</script>
<style scoped>
#empty {
  z-index: 4;
}
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
  max-width: 40px;
  padding: 5px;
  border: none;
  background: var(--color-background-soft);
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.093);
  line-height: 1em;
}
.table-scroll td {
  font-size: 2em;
}
.table-scroll th span,
.table-scroll td span {
  font-size: 1em;
  margin-left: 8px;
  vertical-align: middle;
}
.table-scroll th.today,
.table-scroll td.today {
  background: rgb(159, 169, 20);
  color: black;
}
.table-scroll thead th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 3;
}
.table-scroll thead th:hover {
  cursor: pointer;
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
th:first-child {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
  text-align: left;
  padding: 26px 12px;
  cursor: pointer;
}
th:first-child:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
</style>
