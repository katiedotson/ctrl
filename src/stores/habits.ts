import { defineStore } from "pinia"
import repository from "@/repository/repository"

export const useHabitsStore = defineStore("habits", {
  state: () => ({
    habits: [] as Habit[],
  }),
  actions: {
    initialize(habits: Habit[]) {
      this.$state.habits = habits
    },
    saveHabitUpdates(id: string, name: string, checkIcon: string) {
      this.$state.habits = this.$state.habits.map((it) => {
        if (it.id == id) {
          it.checkIcon = checkIcon
          it.name = name
        }
        return it
      })
    },
    deleteHabit(id: string) {
      this.$state.habits = this.$state.habits.filter((it) => {
        return it.id !== id
      })
    },
    addNewHabit(habit: Habit) {
      habit.id = (this.$state.habits.length + 1).toString()
      this.$state.habits.push(habit)
      repository
        .updateUserHabits(this.$state.habits)
        .then(() => {
          console.log("success")
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
})

export class Habit {
  name: string
  id: string
  checkIcon: string

  constructor(name: string, id: string, checkIcon: string) {
    this.name = name
    this.id = id
    this.checkIcon = checkIcon
  }
}
