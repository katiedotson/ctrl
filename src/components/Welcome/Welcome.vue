<script setup lang="ts">
import Habits from "./Habits.vue";
import Time from "./Time.vue";
import Modal from "../Modal/Modal.vue";
import EditHabit from "./EditHabit.vue";
</script>

<template>
  <Habits />
  <Time :currentTime="currentTime" />
  <Modal @close-modal="closeHabitModal" v-if="showHabitModal">
    <template v-slot:title> Edit Habit </template>
    <template v-slot:content>
      <EditHabit :habitProp="currentHabit" />
    </template>
  </Modal>
</template>

<script lang="ts">
import { useHabitsStore, Habit } from "@/stores/habits";

export default {
  mounted() {
    // listen to habit click
    const habitsStore = useHabitsStore();
    habitsStore.$subscribe((mutation, state) => {
      this.showHabitModal = state.showHabitModal !== "";
      this.currentHabit = state.currentHabit as Habit;
    });

    // time
    setInterval(() => {
      this.updateTime();
    }, 1000);
  },
  methods: {
    updateTime() {
      this.currentTime = Date.now();
    },
    onOpenHabitModal() {
      this.showHabitModal = true;
    },
    closeHabitModal() {
      const habitsStore = useHabitsStore();
      habitsStore.showHabitModal("");
    },
  },
  data() {
    return {
      currentTime: Date.now(),
      showHabitModal: false,
      currentHabit: {
        name: "Food",
        isChecked: false,
        id: "0",
        checkIcon: "&#9889;",
      } as Habit,
    };
  },
};
</script>
