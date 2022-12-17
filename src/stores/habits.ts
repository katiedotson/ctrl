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
      const lastHabitId = this.$state.habits.sort((a: Habit, b: Habit) => {
        return Number(a.id) - Number(b.id)
      })[this.$state.habits.length - 1].id
      habit.id = (Number(lastHabitId) + 1).toString()
      this.$state.habits.push(habit)
      this.updateToRepo()
    },
    updateToRepo() {
      repository
        .updateUserHabits(this.$state.habits)
        .then(() => {
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    errorLoadingData() {
      this.$state.loading = false
    },
  },
})
