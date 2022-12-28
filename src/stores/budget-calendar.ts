import repository from "@/repository/repository"
import type { BudgetDay, BudgetEntry } from "@/types/types"
import { DateUtils } from "@/util/date-utils"
import { defineStore } from "pinia"

export const useBudgetCalendarStore = defineStore("budget-calendar", {
  state: () => ({
    allDays: [] as BudgetDay[],
    calendar: [] as BudgetDay[],
    currentDay: {} as BudgetDay,
    startDate: DateUtils.startOfWeek(new Date()),
    endDate: DateUtils.plusWeeks(DateUtils.startOfWeek(new Date()), 1),
    loading: true,
  }),
  actions: {
    initialize() {
      const initialCal = this.createBudgetDaysForDateRange(this.startDate, this.endDate)
      repository
        .initializeBudgetCalendar(initialCal)
        .then((res) => {
          if (res) {
            this.setCalendar(res)
          } else {
            throw Error("No response from API")
          }
        })
        .catch((err) => {
          console.error(err)
          this.loading = false
        })
    },

    createBudgetDaysForDateRange(startDate: Date, endDate: Date): BudgetDay[] {
      const calendar: BudgetDay[] = []
      const daysBetween = DateUtils.daysBetween(startDate, endDate)

      for (let index = 0; index < daysBetween; index++) {
        calendar.push({
          date: DateUtils.plusDays(DateUtils.startOfDay(startDate), index),
          id: "",
          entries: [],
        })
      }
      return calendar
    },

    setCalendar(days: BudgetDay[]) {
      this.allDays = days
      this.currentDay = this.allDays.find((day) => {
        return DateUtils.checkIfDaysAreSame(new Date(), day.date)
      })!!
      this.calendar = days
      this.loading = false
    },

    addBudgetEntryForDate(entry: BudgetEntry, date: Date) {
      const budgetDay = this.getBudgetDayFor(date)
      repository
        .updateBudgetCalendarDayEntries(budgetDay, entry)
        .then((res) => {
          if (res) {
            this.allDays.map((day) => {
              if (DateUtils.checkIfDaysAreSame(res.date, day.date)) {
                if (!res.entries) {
                  res.entries = []
                }
                res.entries.push(entry)
                return res
              } else return day
            })
          }
        })
        .catch((err) => {
          console.error(err)
          this.loading = false
        })
    },

    getBudgetDayFor(date: Date): BudgetDay {
      return this.allDays.find((day) => {
        return DateUtils.checkIfDaysAreSame(day.date, date)
      })!!
    },
  },
})
