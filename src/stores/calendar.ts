import moment from "moment";
import { defineStore } from "pinia";
import type { Habit } from "./habits";

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    calendar: [] as AppDay[],
    allDates: [
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
      {
        date: new Date("2022-12-13"),
        habitsCompleted: ["0", "1", "3"],
      },
      {
        date: new Date("2022-12-14"),
        habitsCompleted: ["0", "3"],
      },
      {
        date: new Date("2022-12-15"),
        habitsCompleted: ["3"],
      },
      {
        date: new Date("2022-12-16"),
        habitsCompleted: ["1"],
      },
      {
        date: new Date("2022-12-17"),
        habitsCompleted: ["0", "1", "2", "3"],
      },
      {
        date: new Date("2022-12-18"),
        habitsCompleted: ["0", "1", "3"],
      },
      {
        date: new Date("2022-12-19"),
        habitsCompleted: ["0"],
      },
    ] as AppDay[],
    startDate: moment(new Date()).day("Monday").toDate(),
  }),
  actions: {
    markHabitCompleteForDay(habitId: string, date: Date) {
      this.$state.calendar = this.$state.calendar.map((calendarDay) => {
        if (date == calendarDay.date) {
          calendarDay.habitsCompleted.push(habitId);
        }
        return calendarDay;
      });
    },
    toggleHabitForDate(date: AppDay, habit: Habit) {
      this.$state.calendar = this.$state.calendar.map((day) => {
        if (day.date == date.date) {
          if (day.habitsCompleted.some((id) => id == habit.id)) {
            day.habitsCompleted = day.habitsCompleted.filter(
              (id) => id != habit.id
            );
          } else {
            day.habitsCompleted.push(habit.id);
          }
        }
        return day;
      });
    },
    loadCalendar() {
      const result = this.$state.allDates.filter((appDay) => {
        return moment(appDay.date).isSameOrAfter(
          moment(this.$state.startDate).startOf("D")
        );
      });
      this.$state.calendar = result;
    },
  },
});

export class AppDay {
  date: Date;
  habitsCompleted: string[];

  constructor(date: Date, habitsCompleted: string[]) {
    this.date = date;
    this.habitsCompleted = habitsCompleted;
  }
}
