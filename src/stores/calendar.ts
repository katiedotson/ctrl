import repository from "@/repository/repository"
import type { AppDay, Habit } from "@/types/types"
import { DateTime } from "luxon"
import { defineStore } from "pinia"

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    loading: true,
    calendar: [] as AppDay[],
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
          id: "",
        })
      }
      return calendar
    },

    setUserCalendar(dates: AppDay[]) {
      this.$state.calendar = dates
      this.loadCurrentDay()
      this.loadCalendar()
    },

    loadCurrentDay() {
      const today = this.$state.calendar.find((day) => {
        return this.checkIfDaysAreSame(new Date(), day.date)
      })!!
      this.$state.currentDay = today
    },

    loadCalendar() {
      const startDay = DateTime.fromJSDate(this.$state.startDate)
      const endDay = DateTime.fromJSDate(this.$state.startDate).plus({
        days: 7,
      })
      const result = this.$state.calendar.filter((appDay) => {
        const thisDay = DateTime.fromJSDate(appDay.date)
        return thisDay >= startDay && thisDay <= endDay
      })
      this.$state.calendar = result
      this.loading = false
    },

    checkIfDaysAreSame(dateOne: Date, dateTwo: Date): Boolean {
      const daysAreTheSame = DateTime.fromJSDate(dateOne).startOf("day").toMillis() == DateTime.fromJSDate(dateTwo).startOf("day").toMillis()
      return daysAreTheSame
    },

    toggleHabitForDate(date: AppDay, habit: Habit) {
      // find matching day
      const dayFromState = this.$state.calendar.find((day) => {
        return this.checkIfDaysAreSame(date.date, day.date)
      })!!

      // update habits for that day
      if (dayFromState.habitsCompleted.some((id) => id == habit.id)) {
        dayFromState.habitsCompleted = dayFromState.habitsCompleted.filter((id) => id != habit.id)
      } else {
        dayFromState.habitsCompleted.push(habit.id)
      }

      repository
        .updateUserCalendar(dayFromState)
        .then((res) => {
          if (res) {
            // update calendar in state
            this.$state.calendar = this.$state.calendar.map((day) => {
              if (this.checkIfDaysAreSame(date?.date!!, day.date)) {
                day = dayFromState
              }
              return day
            })

            // update today in state if the updated day was today
            if (this.checkIfDaysAreSame(date.date, this.$state.currentDay.date!!)) {
              this.$state.currentDay = this.$state.calendar.find((appDay) => {
                return this.checkIfDaysAreSame(appDay.date, this.$state.currentDay.date!!)
              })!!
            }
            this.loading = false
          }
        })
        .catch((err) => {
          console.error(err)
          this.loading = false
        })
    },

    changeStartDate(numOfWeeks: number) {
      this.loading = true
      this.$state.startDate = DateTime.fromJSDate(this.$state.startDate).plus({ week: numOfWeeks }).toJSDate()
      this.loadCalendar()
    },

    isHabitCompletedToday(habit: Habit): Boolean {
      const matchingDay = this.$state.calendar.find((appDay) => {
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
