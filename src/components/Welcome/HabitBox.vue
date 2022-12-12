<template>
  <div class="habit" @click="onClick">
    <div v-if="isChecked" class="check">&#9889;</div>
    <div class="habit-name">{{ name }}</div>
  </div>
</template>
<script lang="ts">
import { useHabitsStore } from "@/stores/habits";
export default {
  props: {
    name: String,
    isChecked: Boolean,
    id: String,
  },
  methods: {
    onClick: function () {
      const habits = useHabitsStore();
      habits.toggleIsChecked(this.id);
    },
  },
};
</script>
<style scoped>
.habit {
  background: var(--color-background-soft);
  padding: 0.5rem;
  height: 200px;
}
.check {
  font-size: 5rem;
  text-align: center;
  cursor: pointer;
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
</style>
