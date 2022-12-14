<template>
  <section>
    <h1>Date: {{ formattedDate() }}</h1>
    <hr />
    <div class="edit-day-habit" v-for="habit in habits">
      <label class="container"
        >{{ habit.name }}
        <input
          type="checkbox"
          :checked="showHabitCheckForDate(habit)"
          @change="checkboxChange(habit)"
        />
        <span class="checkmark"></span>
      </label>
    </div>
  </section>
</template>
<script lang="ts">
import { Habit } from "@/stores/habits";
import { AppDay, useCalendarStore } from "@/stores/calendar";
import moment from "moment";
export default {
  props: {
    habits: {
      type: Array<Habit>,
    },
    day: {
      type: AppDay,
    },
  },
  methods: {
    showHabitCheckForDate(habit: Habit): Boolean {
      return this.$props.day.habitsCompleted.some(
        (habitId) => habitId == habit.id
      );
    },
    checkboxChange(habit: Habit) {
      const calendarStore = useCalendarStore();
      calendarStore.toggleHabitForDate(this.$props.day, habit);
    },
    formattedDate() {
      return moment(this.$props.day.date).format("ddd MMM D");
    },
  },
};
</script>
<style scoped>
.edit-day-habit {
  display: flex;
  margin-top: 12px;
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
  line-height: 1rem;
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
.container:hover input ~ .checkmark {
  background-color: #ccc;
}
.container input:checked ~ .checkmark {
  background-color: #2196f3;
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
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
