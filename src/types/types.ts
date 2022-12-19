export interface UserData {
  userId: string
  calendar: AppDay[]
  habits: Habit[]
  name: string
}

export interface AppDay {
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
  calendar: DbAppDay[]
  habits: Habit[]
  name: string
}

export interface DbAppDay {
  date: string
  habitsCompleted: string[]
}
