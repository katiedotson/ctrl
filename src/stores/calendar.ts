import repository from "@/repository/repository"
import type { AppDay, Habit } from "@/types/types"
import { DateTime } from "luxon"
import { defineStore } from "pinia"

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    loading: true,
    allDays: [] as AppDay[],
    calendar: [] as AppDay[],
    startDate: DateTime.fromJSDate(new Date()).startOf("week").toJSDate(),
    currentDay: {} as AppDay,
  }),
  actions: {
    initialize() {
      const initialCalendar = this.createAppDaysFromStartingDate(new Date())
      repository.initializeCalendar(initialCalendar).then((_) => {
        this.setUserCalendar(initialCalendar)
      })
    },

    createAppDaysFromStartingDate(startDate: Date): AppDay[] {
      const calendar: AppDay[] = []
      const lastMonday = DateTime.fromJSDate(startDate).startOf("week")
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
      this.$state.allDays.push(...dates)
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
      const endDay = DateTime.fromJSDate(this.$state.startDate).plus({
        days: 7,
      })
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

    changeStartDate(numOfWeeks: number) {
      this.loading = true

      const startDate = DateTime.fromJSDate(this.$state.startDate).plus({ week: numOfWeeks })
      this.$state.startDate = startDate.toJSDate()

      const daysAlreadyExisting = this.allDays.filter((day) => {
        const thisDay = DateTime.fromJSDate(day.date)
        return thisDay < startDate.plus({ week: 1 }) && thisDay >= startDate
      })

      if (daysAlreadyExisting.length < 7) {
        const missingDays = this.createAppDaysFromStartingDate(startDate.toJSDate())

        repository
          .loadAdditionalDays(missingDays)
          .then((daysAdded) => {
            if (daysAdded) {
              this.setUserCalendar(daysAdded)
            }
          })
          .catch((err) => console.error(err))
      } else {
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
