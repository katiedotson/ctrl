export interface UserData {
  userId: string
  habitCalendar: HabitDay[]
  habits: Habit[]
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

export interface Id {
  id: string
}
