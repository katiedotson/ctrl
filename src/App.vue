<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
</script>

<template>
  <RouterView />
</template>
<script lang="ts">
import { useCalendarStore } from "./stores/calendar"
import { useHabitsStore } from "./stores/habits"
import { useUserStore } from "./stores/user"
import repository from "./repository/repository"
import type { UserData } from "./repository/repository"
export default {
  beforeCreate() {
    const calendarStore = useCalendarStore()
    const habitsStore = useHabitsStore()
    const userStore = useUserStore()
    repository.loadUserData().then((data: UserData | undefined) => {
      if (data) {
        calendarStore.initialize(data!!.calendar)
        habitsStore.initialize(data!!.habits)
        userStore.initialize(data!!.name)
      }
    })
  },
}
</script>
