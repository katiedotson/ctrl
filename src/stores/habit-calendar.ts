import repository from "@/repository/repository"
import type { HabitDay, Habit } from "@/types/types"
import { DateUtils } from "@/util/date-utils"
import { defineStore } from "pinia"

export const useHabitCalendarStore = defineStore("calendar", {
  state: () => ({
    loading: true,
    allDays: [] as HabitDay[],
    calendar: [] as HabitDay[],
    startDate: DateUtils.startOfWeek(new Date()),
    endDate: DateUtils.plusWeeks(DateUtils.startOfWeek(new Date()), 1),
    currentDay: {} as HabitDay,
  }),
  actions: {
    initialize() {
      const initialCalendar = this.createHabitDaysForDateRange(this.startDate, this.endDate)
      repository.initializeHabitCalendar(initialCalendar).then((_) => {
        this.setHabitCalendar(initialCalendar)
      })
    },

    createHabitDaysForDateRange(startDate: Date, endDate: Date): HabitDay[] {
      const calendar: HabitDay[] = []
      const daysBetween = DateUtils.daysBetween(startDate, endDate)

      for (let index = 0; index < daysBetween; index++) {
        calendar.push({
          date: DateUtils.plusDays(DateUtils.startOfDay(startDate), index),
          habitsCompleted: [],
          id: "",
        })
      }
      return calendar
    },

    createHabitDaysForDates(missingDays: Date[]): HabitDay[] {
      const calendar: HabitDay[] = []
      missingDays.forEach((day) => {
        calendar.push({
          date: day,
          habitsCompleted: [],
          id: "",
        })
      })
      return calendar
    },

    setHabitCalendar(dates: HabitDay[]) {
      this.allDays = dates
      if (this.getCurrentHabitDay() != undefined) {
        this.sortHabitDays()
        this.currentDay = this.getCurrentHabitDay()!!
        this.loadHabitCalendar()
      } else {
        this.sortHabitDays()
        const lastDay = this.allDays[this.allDays.length - 1]
        const nextDay = DateUtils.plusDays(lastDay.date, 1)
        this.loadDateRange(nextDay, DateUtils.endOfWeek(nextDay))
        this.currentDay = this.getCurrentHabitDay()!!
        this.loadHabitCalendar()
      }
    },

    sortHabitDays() {
      this.allDays = this.allDays.sort((dayA, dayB) => {
        // @ts-ignore
        return Number(dayA.date - dayB.date)
      })
    },

    getCurrentHabitDay(): HabitDay | undefined {
      const today = this.allDays.find((day) => {
        return DateUtils.checkIfDaysAreSame(new Date(), day.date)
      })
      return today
    },

    loadHabitCalendar() {
      const result = this.allDays.filter((habitDay) => {
        return DateUtils.isDateBetween(this.startDate, this.endDate, habitDay.date)
      })
      this.calendar = result
      this.loading = false
    },

    toggleHabitForDate(date: HabitDay, habit: Habit) {
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
              if (DateUtils.checkIfDaysAreSame(date?.date!!, day.date)) {
                day = date
              }
              return day
            })

            // update today in state if the updated day was today
            if (DateUtils.checkIfDaysAreSame(date.date, this.currentDay.date!!)) {
              this.currentDay = date
            }

            // reset calendar
            this.loadHabitCalendar()
          }
        })
        .catch((err) => {
          console.error(err)
        })
        .then(() => {
          this.loading = false
        })
    },

    loadDateRange(startDate: Date, endDate: Date) {
      console.log("startDate", startDate)
      console.log("endDate", endDate)

      this.loading = true

      this.startDate = DateUtils.startOfDay(startDate)
      this.endDate = DateUtils.startOfDay(endDate)

      const loadedDays = this.allDays.map((it) => {
        return it.date
      })

      const requestedDays = DateUtils.dateArrayForInterval(this.startDate, this.endDate)
      const missingDays = requestedDays.filter((date) => {
        return !loadedDays.some((day) => {
          return DateUtils.checkIfDaysAreSame(date, day)
        })
      })

      if (missingDays.length > 0) {
        const missingDaysCreated = this.createHabitDaysForDates(missingDays)

        repository
          .loadAdditionalDays(missingDaysCreated)
          .then((daysAdded) => {
            if (daysAdded) {
              // get user days
              repository
                .getUserDays()
                .then((allUserDays: HabitDay[] | undefined) => {
                  if (allUserDays) {
                    this.setHabitCalendar(allUserDays)
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
        this.sortHabitDays()
        this.loadHabitCalendar()
      }
    },

    isHabitCompletedToday(habit: Habit): Boolean {
      const matchingDay = this.allDays.find((habitDay) => {
        return DateUtils.checkIfDaysAreSame(habitDay.date, this.currentDay.date)
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
