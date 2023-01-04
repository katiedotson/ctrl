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

    sortDays(days: BudgetDay[]): BudgetDay[] {
      return days.sort((dayA, dayB) => {
        // @ts-ignore
        return Number(dayA.date - dayB.date)
      })
    },

    setCalendar(days: BudgetDay[]) {
      const sortedDays = this.sortDays(days)
      this.allDays = sortedDays
      this.currentDay = this.allDays.find((day) => {
        return DateUtils.checkIfDaysAreSame(new Date(), day.date)
      })!!
      this.calendar = sortedDays
      this.loading = false
    },

    addBudgetEntryForDate(entry: BudgetEntry, date: Date) {
      const budgetDay = this.getBudgetDayFor(date)
      if (budgetDay) {
        this.addBudgetEntryForExistingDate(entry, budgetDay)
      } else {
        const dayToAdd = this.createBudgetDaysForDateRange(date, DateUtils.plusDays(date, 1))
        repository
          .initializeBudgetCalendar(dayToAdd)
          .then((res) => {
            if (res) {
              this.setCalendar(res)
              const newBudgetDay = this.getBudgetDayFor(date)
              this.addBudgetEntryForExistingDate(entry, newBudgetDay)
            } else {
              throw Error("No response from API")
            }
          })
          .catch((err) => {
            console.error(err)
            this.loading = false
          })
      }
    },

    addBudgetEntryForExistingDate(entry: BudgetEntry, budgetDay: BudgetDay) {
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
