export interface UserData {
  userId: string
  habitCalendar: HabitDay[]
  budgetCalendar: BudgetDay[]
  habits: Habit[]
  budgetCategories: BudgetCategory[]
  name: string
}

export interface HabitDay {
  id: string
  date: Date
  habitsCompleted: string[]
}

export interface Habit {
  name: string
  id: string
  checkIcon: string
}

export interface BudgetCategory {
  id: string
  name: string
  icon: string
}

export interface BudgetDay {
  id: string
  date: Date
  entries: BudgetEntry[]
}

export interface BudgetEntry {
  id: string
  category: string
  cost: number
  notes: string
}

export interface DbUserData {
  userId: string
  habitCalendar: DbHabitDay[]
  habits: Habit[]
  name: string
}

export interface DbHabitDay {
  date: string
  habitsCompleted: string[]
}

export interface DbBudgetDay {
  id: string
  entries: string[]
  date: string
}

export interface Id {
  id: string
}
