<script setup lang="ts">
import HabitBox from "./HabitBox.vue";
</script>
<template>
  <div id="habits-box">
    <h2>Habits</h2>
    <div v-if="habits != undefined && habits.length != 0" id="habits-container">
      <HabitBox
        v-for="habit in habits"
        :name="habit.name"
        :isChecked="habit.isChecked"
      />
    </div>
    <div v-if="habits == undefined || habits.length == 0">
      Nothing here yet.
    </div>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    habits: Array,
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
h2 {
  font-size: 1rem;
}
#habits-box {
  background: hsla(180, 100%, 37%, 0.2);
  padding: 1rem;
  color: var(--color-heading);
}
#habits-container {
  margin: 8px 0;
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr;
}
</style>
