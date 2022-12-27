import type { BudgetDay } from "@/types/types"
import { DateTime } from "luxon"
import { defineStore } from "pinia"

export const useBudgetCalendarStore = defineStore("budget-calendar", {
  state: () => ({
    startDate: DateTime.fromJSDate(new Date()).startOf("week").toJSDate(),
    endDate: DateTime.fromJSDate(new Date()).startOf("week").plus({ weeks: 1 }).toJSDate(),
  }),
  actions: {
    initialize() {
      const initialCal = this.createBudgetDaysForDateRange(this.startDate, this.endDate)
    },
    createBudgetDaysForDateRange(startDate: Date, endDate: Date): BudgetDay[] {
      const calendar: BudgetDay[] = []

      return calendar
    },
  },
})
