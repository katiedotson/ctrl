import { defineStore } from "pinia";

export const useHabitsStore = defineStore("habits", {
  state: () => ({
    habits: [
      {
        name: "Food",
        id: "0",
        checkIcon: "&#129379;",
      },
      { name: "OTF", id: "1", checkIcon: "&#128170;" },
      { name: "Meditate", id: "2", checkIcon: "&#9889;" },
      { name: "Read", id: "3", checkIcon: "&#128218;" },
      { name: "Learn", id: "4", checkIcon: "&#127891;" },
      { name: "Water", id: "5", checkIcon: "&#9889;" },
      { name: "Stretch", id: "6", checkIcon: "&#9889;" },
    ] as Habit[],
    showHabitModal: "" as string,
    currentHabit: undefined as Habit | undefined,
  }),
  actions: {
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
