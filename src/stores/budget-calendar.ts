import repository from "@/repository/repository"
import type { BudgetDay } from "@/types/types"
import { DateUtils } from "@/util/date-utils"
import { defineStore } from "pinia"

export const useBudgetCalendarStore = defineStore("budget-calendar", {
  state: () => ({
    allDays: [] as BudgetDay[],
    calendar: [] as BudgetDay[],
    startDate: DateUtils.startOfWeek(new Date()),
    endDate: DateUtils.plusWeeks(DateUtils.startOfWeek(new Date()), 1),
    loading: true,
  }),
  actions: {
    initialize() {
      const initialCal = this.createBudgetDaysForDateRange(this.startDate, this.endDate)
      repository.initializeBudgetCalendar(initialCal).then((res) => {
        if (res) {
          this.setCalendar(res)
        }
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
      this.calendar = days
      this.loading = false
    },
  },
})
