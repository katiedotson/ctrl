<template>
  <div class="habit">
    <div class="check-wrapper" @click="onClick">
      <div
        v-if="habitProp.isChecked"
        class="check"
        v-html="habitProp.checkIcon"
      ></div>
    </div>
    <div class="habit-name" @click="onOpen">
      <div>{{ habitProp.name }}</div>
      <span>&rarr;</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Habit, useHabitsStore } from "@/stores/habits";
export default {
  props: {
    habitProp: {
      type: Habit,
      required: true,
    },
  },
  methods: {
    onClick: function () {
      const habitsStore = useHabitsStore();
      habitsStore.toggleIsChecked(this.habitProp.id);
    },
    onOpen: function () {
      const habitsStore = useHabitsStore();
      habitsStore.showHabitModal(this.habitProp.id);
    },
  },
};
</script>
<style scoped>
.habit {
  background: var(--color-background-soft);
  padding: 0.5rem;
  height: 200px;
  cursor: pointer;
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
  bottom: 2px;
  left: 0px;
  padding: 4px;
}
.habit-name div {
  display: inline-block;
}
.habit-name span {
  display: none;
}
.habit-name:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
  line-height: 2.5rem;
}
.habit-name:hover span {
  line-height: 2.5rem 1s ease-in;
  font-size: 1.5rem;
  display: block;
  float: right;
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
</style>
