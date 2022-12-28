import { defineStore } from "pinia"
import repository from "@/repository/repository"
import type { Habit } from "@/types/types"

export const useHabitsStore = defineStore("habits", {
  state: () => ({
    habits: [] as Habit[],
    loading: true,
  }),
  actions: {
    initialize() {
      const habits = this.initialHabits()
      repository
        .initializeHabits(habits)
        .then((_) => {
          this.setUserHabits(habits)
        })
        .catch((err) => {
          this.loading = false
          console.error(err)
        })
    },
    initialHabits(): Habit[] {
      return [
        {
          name: "Sleep at least 6 hours",
          id: "1",
          checkIcon: "&#128164;",
        },
      ]
    },
    setUserHabits(habits: Habit[]) {
      this.$state.habits = habits
      this.loading = false
    },
    saveHabitUpdates(id: string, name: string, checkIcon: string) {
      this.$state.habits = this.$state.habits.map((it) => {
        if (it.id == id) {
          it.checkIcon = checkIcon
          it.name = name
        }
        return it
      })
      this.updateToRepo()
    },
    deleteHabit(id: string) {
      this.$state.habits = this.$state.habits.filter((it) => {
        return it.id !== id
      })
      this.updateToRepo()
    },
    addNewHabit(habit: Habit) {
      this.loading = true
      repository
        .addHabit(habit)
        .then((res) => {
          this.$state.habits.push(res as Habit)
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          console.error(err)
        })
    },
    updateToRepo() {
      repository
        .updateUserHabits(this.$state.habits)
        .then(() => {
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          console.error(err)
        })
    },
    errorLoadingData() {
      this.$state.loading = false
    },
  },
})
