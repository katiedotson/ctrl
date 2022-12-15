<script setup lang="ts">
import Habits from "./Habits.vue"
import Time from "./Time.vue"
import Modal from "../Modal/Modal.vue"
import EditHabit from "./EditHabit.vue"
import Welcome from "./Welcome.vue"
import Login from "./Login.vue"
</script>

<template>
  <section v-if="user">
    <Welcome />
    <Habits @habits-clicked="habitsTitleClicked" />
    <Time :currentTime="currentTime" />
    <Modal @close-modal="closeHabitModal" v-if="showHabitModal">
      <template v-slot:title> Edit Habit </template>
      <template v-slot:content>
        <EditHabit :habitProp="currentHabit" />
      </template>
    </Modal>
  </section>
  <section v-if="!user">
    <Login />
  </section>
</template>

<script lang="ts">
import { useHabitsStore, Habit } from "@/stores/habits"
import { useUserStore } from "@/stores/user"

export default {
  mounted() {
    // listen to habit click
    const habitsStore = useHabitsStore()
    habitsStore.$subscribe((_, state) => {
      this.showHabitModal = state.showHabitModal !== ""
      this.currentHabit = state.currentHabit as Habit
    })

    // time
    setInterval(() => {
      this.updateTime()
    }, 1000)

    // user
    const userStore = useUserStore()
    userStore.$subscribe((_, state) => {
      this.user = state.name
    })
  },
  methods: {
    updateTime() {
      this.currentTime = Date.now()
    },
    onOpenHabitModal() {
      this.showHabitModal = true
    },
    closeHabitModal() {
      const habitsStore = useHabitsStore()
      habitsStore.showHabitModal("")
    },
    habitsTitleClicked() {
      this.$router.push("/habits")
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
      user: "" as string,
    }
  },
}
</script>
