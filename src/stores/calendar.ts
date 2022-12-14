import { DateTime } from "luxon";
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
        habitsCompleted: [],
      },
      {
        date: new Date("2022-12-16"),
        habitsCompleted: [],
      },
      {
        date: new Date("2022-12-17"),
        habitsCompleted: [],
      },
      {
        date: new Date("2022-12-18"),
        habitsCompleted: [],
      },
      {
        date: new Date("2022-12-19"),
        habitsCompleted: [],
      },
    ] as AppDay[],
    startDate: DateTime.fromJSDate(new Date()).startOf("week").toJSDate(),
    currentDay: {} as AppDay,
  }),
  actions: {
    checkIfDaysAreSame(dateOne: Date, dateTwo: Date): Boolean {
      return (
        DateTime.fromJSDate(dateOne).startOf("day").toMillis() ==
        DateTime.fromJSDate(dateTwo).startOf("day").toMillis()
      );
    },
    toggleHabitForDate(date: AppDay, habit: Habit) {
      this.$state.calendar = this.$state.calendar.map((day) => {
        if (this.checkIfDaysAreSame(date?.date!!, day.date)) {
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
      if (this.checkIfDaysAreSame(date.date, this.$state.currentDay.date!!)) {
        this.$state.currentDay = this.$state.calendar.find((appDay) => {
          return this.checkIfDaysAreSame(
            appDay.date,
            this.$state.currentDay.date!!
          );
        })!!;
      }
    },
    loadCalendar() {
      const startDay = DateTime.fromJSDate(this.$state.startDate);
      const endDay = DateTime.fromJSDate(this.$state.startDate).plus({
        days: 7,
      });
      const result = this.$state.allDates.filter((appDay) => {
        const thisDay = DateTime.fromJSDate(appDay.date);
        return thisDay >= startDay && thisDay <= endDay;
      });
      this.$state.calendar = result;
    },
    changeStartDate(numOfWeeks: number) {
      this.$state.startDate = DateTime.fromJSDate(this.$state.startDate)
        .plus({ week: numOfWeeks })
        .toJSDate();
      this.loadCalendar();
    },
    loadCurrentDay() {
      const todayAppDay = this.$state.allDates.find((day) => {
        return this.checkIfDaysAreSame(new Date(), day.date);
      })!!;
      this.$state.currentDay = todayAppDay;
    },
    isHabitCompletedToday(habit: Habit): Boolean {
      const matchingDay = this.$state.allDates.find((appDay) => {
        return this.checkIfDaysAreSame(
          appDay.date,
          this.$state.currentDay.date
        );
      })!!;
      return matchingDay.habitsCompleted.some((habitId) => {
        return habitId == habit.id;
      });
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
