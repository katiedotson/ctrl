<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
import Settings from "@/components/Settings/Settings.vue"
import Loading from "@/components/Loading/Loading.vue"
import { useUserStore } from "@/stores/user"
import { useHabitsStore } from "@/stores/habits"
import { useHabitCalendarStore } from "@/stores/habit-calendar"
</script>

<template>
  <Loading :show-loading="showLoading" />
  <Settings />
  <RouterView />
</template>

<script lang="ts">
export default {
  data() {
    return {
      userLoading: true,
      habitsLoading: true,
      calendarLoading: true,
    }
  },
  mounted() {
    const userStore = useUserStore()
    const habitsStore = useHabitsStore()
    const calendarStore = useHabitCalendarStore()

    userStore.$subscribe((_, state) => {
      this.userLoading = state.loading
    })

    habitsStore.$subscribe((_, state) => {
      this.habitsLoading = state.loading
    })

    calendarStore.$subscribe((_, state) => {
      this.calendarLoading = state.loading
    })
  },
  computed: {
    showLoading(): boolean {
      return this.userLoading || this.habitsLoading || this.calendarLoading
    },
  },
}
</script>
