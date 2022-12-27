<template>
  <section>
    <h1>Date: {{ formattedDate() }}</h1>
    <hr />
    <div class="edit-day-habit" v-for="habit in habits" v-bind:key="habit.id">
      <label class="container">
        <p>{{ habit.name }}</p>
        <input type="checkbox" :checked="showHabitCheckForDate(habit)" @change="checkboxChange(habit)" />
        <span class="checkmark"></span>
      </label>
    </div>
  </section>
</template>
<script lang="ts">
import type { Habit, HabitDay } from "@/types/types"
import { useHabitCalendarStore } from "@/stores/habit-calendar"
import { DateTime } from "luxon"
export default {
  props: {
    habits: {
      type: Array as () => Array<Habit>,
      required: true,
    },
    day: {
      type: Object as () => HabitDay,
      required: true,
    },
  },
  methods: {
    showHabitCheckForDate(habit: Habit): Boolean {
      return this.$props.day.habitsCompleted.some((habitId: string) => habitId == habit.id) ?? false
    },
    checkboxChange(habit: Habit) {
      const calendarStore = useHabitCalendarStore()
      calendarStore.toggleHabitForDate(this.$props?.day, habit)
    },
    formattedDate(): string {
      return DateTime.fromJSDate(this.$props.day.date).toFormat("DDDD")
    },
  },
}
</script>
<style scoped>
hr {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}
.edit-day-habit {
  display: flex;
  margin-top: 12px;
  height: 2.5rem;
}
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  line-height: 2rem;
}
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}
.container p {
  font-size: 1rem;
  line-height: 2rem;
}
.container:hover input ~ .checkmark {
  background-color: #ccc;
}
.container input:checked ~ .checkmark {
  background-color: #18b82b8b;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.container input:checked ~ .checkmark:after {
  display: block;
}
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid rgba(255, 255, 255, 0.661);
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
