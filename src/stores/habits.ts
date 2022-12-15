import { defineStore } from "pinia";

export const useHabitsStore = defineStore("habits", {
  state: () => ({
    habits: [] as Habit[],
    showHabitModal: "" as string,
    currentHabit: undefined as Habit | undefined,
  }),
  actions: {
    initialize(habits: Habit[]) {
      console.log(habits);
      this.$state.habits = habits;
    },
    showHabitModal(habitId: string) {
      this.$state.showHabitModal = habitId;
      this.$state.currentHabit = this.$state.habits.find(
        (it) => it.id == this.$state.showHabitModal
      );
    },
    saveHabitUpdates(id: string, name: string, checkIcon: string) {
      this.$state.habits = this.habits.map((it) => {
        if (it.id == id) {
          it.checkIcon = checkIcon;
          it.name = name;
        }
        return it;
      });
    },
    deleteHabit(id: string) {
      this.$state.habits = this.$state.habits.filter((it) => {
        return it.id !== id;
      });
    },
  },
});

export class Habit {
  name: string;
  id: string;
  checkIcon: string;

  constructor(name: string, id: string, checkIcon: string) {
    this.name = name;
    this.id = id;
    this.checkIcon = checkIcon;
  }
}
