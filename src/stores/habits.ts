import { defineStore } from "pinia";

export const useHabitsStore = defineStore("habits", {
  state: () => {
    return {
      habits: [
        { name: "Food tracking", isChecked: false, id: "0" },
        { name: "OTF", isChecked: true, id: "1" },
        { name: "Meditate", isChecked: true, id: "2" },
        { name: "Read", isChecked: false, id: "3" },
        { name: "Learn", isChecked: false, id: "4" },
        { name: "Water", isChecked: false, id: "5" },
        { name: "Stretch", isChecked: false, id: "6" },
      ],
    };
  },
  actions: {
    toggleIsChecked(habitId: String) {
      this.habits = this.habits.map((it) => {
        if (it.id == habitId) it.isChecked = !it.isChecked;
        return it;
      });
      console.log(this.habits);
    },
  },
});
