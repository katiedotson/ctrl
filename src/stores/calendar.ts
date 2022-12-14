import { DateTime } from "luxon";
import { defineStore } from "pinia";
import type { Habit } from "./habits";

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    calendar: [] as AppDay[],
    allDates: [] as AppDay[],
    startDate: DateTime.fromJSDate(new Date()).startOf("week").toJSDate(),
    currentDay: {} as AppDay,
  }),
  actions: {
    initialize() {
      this.loadCurrentDay();
      this.loadCalendar();
    },
    loadCurrentDay() {
      const todayAppDay = this.$state.allDates.find((day) => {
        return this.checkIfDaysAreSame(new Date(), day.date);
      })!!;
      this.$state.currentDay = todayAppDay;
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
    changeStartDate(numOfWeeks: number) {
      this.$state.startDate = DateTime.fromJSDate(this.$state.startDate)
        .plus({ week: numOfWeeks })
        .toJSDate();
      this.loadCalendar();
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
