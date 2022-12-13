import { defineStore } from "pinia";

export const useHabitsStore = defineStore("habits", {
  state: () => ({
    habits: [
      {
        name: "Food",
        isChecked: false,
        id: "0",
        checkIcon: "&#9889;",
      },
      { name: "OTF", isChecked: true, id: "1", checkIcon: "&#9889;" },
      { name: "Meditate", isChecked: true, id: "2", checkIcon: "&#9889;" },
      { name: "Read", isChecked: false, id: "3", checkIcon: "&#9889;" },
      { name: "Learn", isChecked: false, id: "4", checkIcon: "&#9889;" },
      { name: "Water", isChecked: false, id: "5", checkIcon: "&#9889;" },
      { name: "Stretch", isChecked: false, id: "6", checkIcon: "&#9889;" },
    ] as Habit[],
    showHabitModal: "" as string,
    currentHabit: undefined as Habit | undefined,
  }),
  actions: {
    toggleIsChecked(habitId: string) {
      this.$state.habits = this.habits.map((it) => {
        if (it.id == habitId) it.isChecked = !it.isChecked;
        return it;
      });
    },
    showHabitModal(habitId: string) {
      this.$state.showHabitModal = habitId;
      this.$state.currentHabit = this.$state.habits.find(
        (it) => it.id == this.$state.showHabitModal
      );
    },
  },
});

export class Habit {
  name: String;
  isChecked: Boolean;
  id: string;
  checkIcon: string;

  constructor(name: String, isChecked: Boolean, id: string, checkIcon: string) {
    this.name = name;
    this.isChecked = isChecked;
    this.id = id;
    this.checkIcon = checkIcon;
  }
}
