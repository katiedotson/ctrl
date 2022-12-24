import repository from "@/repository/repository"
import type { AppDay, Habit } from "@/types/types"
import { DateTime, Interval } from "luxon"
import { defineStore } from "pinia"

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    loading: true,
    allDays: [] as AppDay[],
    calendar: [] as AppDay[],
    startDate: DateTime.fromJSDate(new Date()).startOf("week").toJSDate(),
    endDate: DateTime.fromJSDate(new Date()).startOf("week").plus({ weeks: 1 }).toJSDate(),
    currentDay: {} as AppDay,
  }),
  actions: {
    initialize() {
      const initialCalendar = this.createAppDaysForDateRange(this.$state.startDate, this.$state.endDate)
      repository.initializeCalendar(initialCalendar).then((_) => {
        this.setUserCalendar(initialCalendar)
      })
    },

    createAppDaysForDateRange(startDate: Date, endDate: Date): AppDay[] {
      const calendar: AppDay[] = []
      const interval = Interval.fromDateTimes(startDate, endDate)
      const daysBetween = interval.start.diff(interval.end, "day").toObject().days
      const daysBetweenAbs = Math.abs(daysBetween!!)

      for (let index = 0; index < daysBetweenAbs; index++) {
        calendar.push({
          date: DateTime.fromJSDate(startDate).startOf("day").plus({ days: index }).toJSDate(),
          habitsCompleted: [],
          id: "",
        })
      }
      return calendar
    },

    setUserCalendar(dates: AppDay[]) {
      this.$state.allDays = dates
      this.$state.allDays.sort((dayA, dayB) => {
        return Number(dayA.date.getMilliseconds) - Number(dayB.date.getMilliseconds)
      })
      this.loadCurrentDay()
      this.loadCalendar()
    },

    loadCurrentDay() {
      const today = this.$state.allDays.find((day) => {
        return this.checkIfDaysAreSame(new Date(), day.date)
      })!!
      this.$state.currentDay = today
    },

    loadCalendar() {
      const startDay = DateTime.fromJSDate(this.$state.startDate)
      const endDay = DateTime.fromJSDate(this.$state.endDate)
      const result = this.$state.allDays.filter((appDay) => {
        const thisDay = DateTime.fromJSDate(appDay.date)
        return thisDay >= startDay && thisDay < endDay
      })
      this.$state.calendar = result
      this.loading = false
    },

    checkIfDaysAreSame(dateOne: Date, dateTwo: Date): Boolean {
      const daysAreTheSame = DateTime.fromJSDate(dateOne).startOf("day").toMillis() == DateTime.fromJSDate(dateTwo).startOf("day").toMillis()
      return daysAreTheSame
    },

    toggleHabitForDate(date: AppDay, habit: Habit) {
      this.loading = true

      // update habits for that day
      if (date.habitsCompleted.some((id) => id == habit.id)) {
        date.habitsCompleted = date.habitsCompleted.filter((id) => id != habit.id)
      } else {
        date.habitsCompleted.push(habit.id)
      }

      // send to api
      repository
        .updateUserCalendar(date)
        .then((res) => {
          if (res) {
            // update day in state
            this.$state.allDays = this.$state.allDays.map((day) => {
              if (this.checkIfDaysAreSame(date?.date!!, day.date)) {
                day = date
              }
              return day
            })

            // update today in state if the updated day was today
            if (this.checkIfDaysAreSame(date.date, this.$state.currentDay.date!!)) {
              this.$state.currentDay = date
            }

            // reset calendar
            this.loadCalendar()
          }
        })
        .catch((err) => {
          console.error(err)
        })
        .then(() => {
          this.loading = false
        })
    },

    changeDateRange(startDate: Date, endDate: Date) {
      this.loading = true

      this.$state.startDate = startDate
      this.$state.endDate = endDate

      const requestedInterval = Interval.fromDateTimes(startDate, endDate)
      const loadedInterval = Interval.fromDateTimes(this.allDays[0].date, this.allDays[this.allDays.length - 1].date)

      const missingDays = requestedInterval.splitBy({ days: 1 }).filter((date) => {
        return !loadedInterval.contains(date.start.startOf("day"))
      })

      if (missingDays.length > 0) {
        const firstMissingDay = missingDays[0].start.toJSDate()
        const lastMissingDay = missingDays[missingDays.length - 1].end.toJSDate()
        const missingDaysCreated = this.createAppDaysForDateRange(firstMissingDay, lastMissingDay)

        repository
          .loadAdditionalDays(missingDaysCreated)
          .then((daysAdded) => {
            if (daysAdded) {
              this.setUserCalendar(daysAdded)
            }
          })
          .catch((err) => console.error(err))
      } else {
        this.startDate = startDate
        this.endDate = endDate
        this.loadCalendar()
      }
    },

    isHabitCompletedToday(habit: Habit): Boolean {
      const matchingDay = this.$state.allDays.find((appDay) => {
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
