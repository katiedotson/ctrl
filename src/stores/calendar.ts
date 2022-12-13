import { defineStore } from "pinia";

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    calendar: [
      {
        date: new Date("2022-12-06"),
        habitsCompleted: ["0", "1", "3"],
      },
      {
        date: new Date("2022-12-07"),
        habitsCompleted: ["0", "3"],
      },
      {
        date: new Date("2022-12-08"),
        habitsCompleted: ["3"],
      },
      {
        date: new Date("2022-12-09"),
        habitsCompleted: ["1"],
      },
      {
        date: new Date("2022-12-10"),
        habitsCompleted: ["0", "1", "2", "3"],
      },
      {
        date: new Date("2022-12-11"),
        habitsCompleted: ["0", "1", "3"],
      },
      {
        date: new Date("2022-12-12"),
        habitsCompleted: ["0"],
      },
    ],
  }),
});
