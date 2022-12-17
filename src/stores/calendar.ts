import repository from "@/repository/repository"
import type { AppDay, Habit } from "@/types/types"
import { DateTime } from "luxon"
import { defineStore } from "pinia"

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    loading: true,
    calendar: [] as AppDay[],
    allDates: [] as AppDay[],
    startDate: DateTime.fromJSDate(new Date()).startOf("week").toJSDate(),
    currentDay: {} as AppDay,
  }),
  actions: {
    initialize() {
      const initialCalendar = this.initialCalendar()
      repository.initializeCalendar(initialCalendar).then((_) => {
        this.setUserCalendar(initialCalendar)
      })
    },
    initialCalendar(): AppDay[] {
      const calendar: AppDay[] = []
      const lastMonday = DateTime.fromJSDate(new Date()).startOf("week")
      for (let index = 0; index < 7; index++) {
        calendar.push({
          date: lastMonday.plus({ days: index }).toJSDate(),
          habitsCompleted: [],
        })
      }
      return calendar
    },
    setUserCalendar(dates: AppDay[]) {
      this.$state.allDates = dates
      this.loadCurrentDay()
      this.loadCalendar()
    },
    loadCurrentDay() {
      const todayAppDay = this.$state.allDates.find((day) => {
        return this.checkIfDaysAreSame(new Date(), day.date)
      })!!
      this.$state.currentDay = todayAppDay
    },
    loadCalendar() {
      const startDay = DateTime.fromJSDate(this.$state.startDate)
      const endDay = DateTime.fromJSDate(this.$state.startDate).plus({
        days: 7,
      })
      const result = this.$state.allDates.filter((appDay) => {
        const thisDay = DateTime.fromJSDate(appDay.date)
        return thisDay >= startDay && thisDay <= endDay
      })
      this.$state.calendar = result
      this.loading = false
    },
    checkIfDaysAreSame(dateOne: Date, dateTwo: Date): Boolean {
      return DateTime.fromJSDate(dateOne).startOf("day").toMillis() == DateTime.fromJSDate(dateTwo).startOf("day").toMillis()
    },
    toggleHabitForDate(date: AppDay, habit: Habit) {
      this.$state.calendar = this.$state.calendar.map((day) => {
        if (this.checkIfDaysAreSame(date?.date!!, day.date)) {
          if (day.habitsCompleted.some((id) => id == habit.id)) {
            day.habitsCompleted = day.habitsCompleted.filter((id) => id != habit.id)
          } else {
            day.habitsCompleted.push(habit.id)
          }
        }
        return day
      })
      if (this.checkIfDaysAreSame(date.date, this.$state.currentDay.date!!)) {
        this.$state.currentDay = this.$state.calendar.find((appDay) => {
          return this.checkIfDaysAreSame(appDay.date, this.$state.currentDay.date!!)
        })!!
      }
    },
    changeStartDate(numOfWeeks: number) {
      this.loading = true
      this.$state.startDate = DateTime.fromJSDate(this.$state.startDate).plus({ week: numOfWeeks }).toJSDate()
      this.loadCalendar()
    },
    isHabitCompletedToday(habit: Habit): Boolean {
      const matchingDay = this.$state.allDates.find((appDay) => {
        return this.checkIfDaysAreSame(appDay.date, this.$state.currentDay.date)
      })!!
      return matchingDay.habitsCompleted.some((habitId) => {
        return habitId == habit.id
      })
    },
    errorLoadingData() {
      this.$state.loading = false
    },
  },
})
