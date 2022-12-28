import type { HabitDay, DbHabitDay, DbUserData, Habit, Id, UserData, BudgetCategory, BudgetDay, DbBudgetDay } from "@/types/types"

export default {
  toDbHabitDay(habitDay: HabitDay): DbHabitDay {
    return {
      habitsCompleted: habitDay.habitsCompleted,
      date: habitDay.date.toUTCString(),
    }
  },

  toDbBudgetDay(budgetDay: BudgetDay): DbBudgetDay {
    return {
      id: budgetDay.id,
      date: budgetDay.date.toUTCString(),
      entries: budgetDay.entries,
    }
  },

  userFromDatabaseResponse(userResponse: any): UserData {
    const userData = {
      name: userResponse.name,
      userId: userResponse.userId,
      habitCalendar: this.flattenToArray<HabitDay>(userResponse.habitCalendar),
      habits: this.flattenToArray<Habit>(userResponse.habits),
      budgetCategories: this.flattenToArray<BudgetCategory>(userResponse.budgetCategories),
      budgetCalendar: this.flattenToArray<BudgetDay>(userResponse.budgetCalendar),
    }
    if (userData.habitCalendar) {
      userData.habitCalendar = this.completeHabitCalendarMapping(userData.habitCalendar)
    }
    if (userData.budgetCalendar) {
      userData.budgetCalendar = this.completeBudgetCalendarMapping(userData.budgetCalendar, userData.budgetCategories)
    }
    console.log("user mapped", userData)
    return userData
  },

  completeHabitCalendarMapping(calendar: HabitDay[]): HabitDay[] {
    calendar.map((habitDay) => {
      if (habitDay && habitDay.habitsCompleted == undefined) {
        habitDay.habitsCompleted = []
      }
      if (habitDay) {
        habitDay.date = new Date(habitDay.date)
      }
    })
    return calendar
  },

  completeBudgetCalendarMapping(calendar: any[], categories: BudgetCategory[]): BudgetDay[] {
    calendar.map((budgetDay) => {
      if (budgetDay && budgetDay.entries) {
        budgetDay.entries = []
      }
      if (budgetDay && budgetDay.entries && budgetDay.entries.length > 0) {
        budgetDay.entries.map((entry: any) => categories.find((category) => category.id == entry))
      }
      if (budgetDay) {
        budgetDay.date = new Date(budgetDay.date)
      }
      return budgetDay
    })
    return calendar
  },

  toDbUser(userData: UserData): DbUserData {
    return {
      userId: userData.userId,
      habitCalendar: userData.habitCalendar.map((habitDay) => {
        return this.toDbHabitDay(habitDay)
      }),
      habits: userData.habits,
      name: userData.name,
    }
  },

  flattenToArray<T extends Id>(objectIn: any): T[] {
    var arrayOut: T[] = []
    for (const key in objectIn) {
      const obj = objectIn[key]
      obj.id = key
      arrayOut.push(obj)
    }
    return arrayOut
  },
}
