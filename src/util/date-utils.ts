import { DateTime, Interval } from "luxon"

export const DateUtils = {
  daysBetween(startDate: Date, endDate: Date): number {
    const interval = Interval.fromDateTimes(startDate, endDate)
    const daysBetween = interval.start.diff(interval.end, "day").toObject().days
    const daysBetweenAbs = Math.abs(daysBetween!!)
    return daysBetweenAbs
  },

  startOfDay(date: Date): Date {
    return DateTime.fromJSDate(date).startOf("day").toJSDate()
  },

  startOfWeek(date: Date): Date {
    return DateTime.fromJSDate(date).startOf("week").toJSDate()
  },

  endOfWeek(date: Date): Date {
    return DateTime.fromJSDate(date).endOf("week").startOf("day").toJSDate()
  },

  plusDays(date: Date, numberOfDays: number): Date {
    return DateTime.fromJSDate(date).plus({ days: numberOfDays }).toJSDate()
  },

  plusWeeks(date: Date, numberOfWeeks: number): Date {
    return DateTime.fromJSDate(date).startOf("week").plus({ weeks: numberOfWeeks }).toJSDate()
  },

  checkIfDaysAreSame(dateOne: Date, dateTwo: Date): Boolean {
    const daysAreTheSame = DateTime.fromJSDate(dateOne).startOf("day").toMillis() == DateTime.fromJSDate(dateTwo).startOf("day").toMillis()
    return daysAreTheSame
  },

  dateArrayForInterval(startDate: Date, endDate: Date): Date[] {
    const requestedDaysInterval = Interval.fromDateTimes(startDate, endDate)
    var requestedDays = [] as Date[]
    requestedDaysInterval.splitBy({ day: 1 }).forEach((it) => {
      requestedDays.push(it.start.toJSDate())
    })
    requestedDays.push(requestedDaysInterval.end.toJSDate())
    return requestedDays
  },

  isDateBetween(startDate: Date, endDate: Date, dateToCheck: Date): boolean {
    const startDay = DateTime.fromJSDate(startDate)
    const endDay = DateTime.fromJSDate(endDate)
    const thisDay = DateTime.fromJSDate(dateToCheck)
    return thisDay >= startDay && thisDay < endDay
  },
}
