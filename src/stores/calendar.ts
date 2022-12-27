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
      const initialCalendar = this.createAppDaysForDateRange(this.startDate, this.endDate)
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

    createAppDaysForMissingDays(missingDays: Date[]): AppDay[] {
      const calendar: AppDay[] = []
      missingDays.forEach((day) => {
        calendar.push({
          date: day,
          habitsCompleted: [],
          id: "",
        })
      })
      return calendar
    },

    setUserCalendar(dates: AppDay[]) {
      this.allDays = dates
      this.sortDays()
      this.loadCurrentDay()
      this.loadCalendar()
    },

    sortDays() {
      this.allDays = this.allDays.sort((dayA, dayB) => {
        // @ts-ignore
        return Number(dayA.date - dayB.date)
      })
    },

    loadCurrentDay() {
      const today = this.allDays.find((day) => {
        return this.checkIfDaysAreSame(new Date(), day.date)
      })!!
      this.currentDay = today
    },

    loadCalendar() {
      const startDay = DateTime.fromJSDate(this.startDate)
      const endDay = DateTime.fromJSDate(this.endDate)
      const result = this.allDays.filter((appDay) => {
        const thisDay = DateTime.fromJSDate(appDay.date)
        return thisDay >= startDay && thisDay < endDay
      })
      this.calendar = result
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
            this.allDays = this.allDays.map((day) => {
              if (this.checkIfDaysAreSame(date?.date!!, day.date)) {
                day = date
              }
              return day
            })

            // update today in state if the updated day was today
            if (this.checkIfDaysAreSame(date.date, this.currentDay.date!!)) {
              this.currentDay = date
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

      this.startDate = DateTime.fromJSDate(startDate).startOf("day").toJSDate()
      this.endDate = DateTime.fromJSDate(endDate).startOf("day").toJSDate()

      const loadedDays = this.allDays.map((it) => {
        return it.date
      })
      const requestedDaysInterval = Interval.fromDateTimes(this.startDate, this.endDate)
      var requestedDays = [] as Date[]
      requestedDaysInterval.splitBy({ day: 1 }).forEach((it) => {
        requestedDays.push(it.start.toJSDate())
      })
      requestedDays.push(requestedDaysInterval.end.toJSDate())

      const missingDays = requestedDays.filter((date) => {
        return !loadedDays.some((day) => {
          return this.checkIfDaysAreSame(date, day)
        })
      })

      if (missingDays.length > 0) {
        const missingDaysCreated = this.createAppDaysForMissingDays(missingDays)

        repository
          .loadAdditionalDays(missingDaysCreated)
          .then((daysAdded) => {
            if (daysAdded) {
              // get user days
              repository
                .getUserDays()
                .then((allUserDays: AppDay[] | undefined) => {
                  if (allUserDays) {
                    this.setUserCalendar(allUserDays)
                  } else {
                    throw Error("Unable to load user days")
                  }
                })
                .catch((err) => {
                  throw err
                })
            }
          })
          .catch((err) => {
            this.loading = false
            console.error(err)
          })
      } else {
        this.sortDays()
        this.loadCalendar()
      }
    },

    isHabitCompletedToday(habit: Habit): Boolean {
      const matchingDay = this.allDays.find((appDay) => {
        return this.checkIfDaysAreSame(appDay.date, this.currentDay.date)
      })!!
      return matchingDay.habitsCompleted.some((habitId) => {
        return habitId == habit.id
      })
    },

    errorLoadingData() {
      this.loading = false
    },
  },
})
