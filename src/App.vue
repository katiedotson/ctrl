<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
</script>

<template>
  <RouterView />
</template>
<script lang="ts">
import { useCalendarStore } from "./stores/calendar"
import { useHabitsStore } from "./stores/habits"
import repository from "./repository/repository"
export default {
  beforeCreate() {
    const calendarStore = useCalendarStore()
    const habitsStore = useHabitsStore()
    repository.loadUserData("1477O6nzbatSEwfG3t0B").then((data) => {
      calendarStore.initialize(data!!.calendar)
      habitsStore.initialize(data!!.habits)
    })
  },
}
</script>
