<template>
  <div class="habit">
    <div class="check-wrapper" @click="onClick">
      <div class="check" v-html="getHtmlForHabit()"></div>
    </div>
    <div class="habit-name">
      <div>{{ habitProp.name }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { useHabitCalendarStore } from "@/stores/habit-calendar"
import type { HabitDay, Habit } from "@/types/types"
export default {
  props: {
    habitProp: {
      type: Object as () => Habit,
      required: true,
    },
    currentDay: {
      type: Object as () => HabitDay,
      required: true,
    },
  },
  methods: {
    onClick: function () {
      const calendarStore = useHabitCalendarStore()
      calendarStore.toggleHabitForDate(this.$props.currentDay, this.$props.habitProp)
    },
    checkHabitCompleted(): Boolean {
      const calendarStore = useHabitCalendarStore()
      return calendarStore.isHabitCompletedToday(this.habitProp)
    },
    getHtmlForHabit(): string {
      const calendarStore = useHabitCalendarStore()
      const isCompleted = calendarStore.isHabitCompletedToday(this.habitProp)

      if (isCompleted) {
        return this.habitProp.checkIcon
      } else {
        return ""
      }
    },
  },
}
</script>
<style scoped>
.habit {
  background: var(--color-background-soft);
  padding: 0.5rem;
  height: 200px;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 20px;
}
.check-wrapper {
  height: 100%;
  width: 100%;
}
.check {
  font-size: 5rem;
  text-align: center;
}
.habit-name {
  width: 100%;
  background: var(--color-background-highlight);
  color: var(--color-on-highlight);
  position: absolute;
  left: 0px;
  bottom: 0;
  padding: 4px;
}
.habit-name div {
  display: inline-block;
}
</style>
