import type { HabitDay, Habit, UserData, BudgetCategory, BudgetDay } from "@/types/types"
import { initializeApp } from "firebase/app"
import { get, getDatabase, push, ref, set, update } from "firebase/database"
import config from "./config"
import { localRepo } from "./local"
import mappers from "./dbMappers"

const firebaseConfig = config

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export default {
  addUser: async (user: UserData): Promise<UserData | undefined> => {
    if (user.userId) {
      await set(ref(db, `users/${user.userId}`), mappers.toDbUser(user))
      return user
    }
    return undefined
  },

  initializeHabitCalendar: async (initialCal: HabitDay[]): Promise<HabitDay[] | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      for (const habitDay of initialCal) {
        const retVal = await push(ref(db, `users/${userId}/habitCalendar`))
        habitDay.id = retVal.key!!
        set(retVal, mappers.toDbHabitDay(habitDay))
      }
      return initialCal
    }
    return undefined
  },

  initializeHabits: async (habits: Habit[]): Promise<Habit[] | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      for (const habit of habits) {
        const retVal = await push(ref(db, `users/${userId}/habits`))
        habit.id = retVal.key!!
        set(retVal, habit)
      }
      return habits
    }
    return undefined
  },

  initializeBudgetCategories: async (categories: BudgetCategory[]): Promise<BudgetCategory[] | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      for (const category of categories) {
        const retVal = await push(ref(db, `users/${userId}/budgetCategories`))
        category.id = retVal.key!!
        set(retVal, category)
      }
      return categories
    }
    return undefined
  },

  initializeBudgetCalendar: async (initialCal: BudgetDay[]): Promise<BudgetDay[] | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      for (const budgetDay of initialCal) {
        const retVal = await push(ref(db, `users/${userId}/budgetCalendar`))
        budgetDay.id = retVal.key!!
        set(retVal, mappers.toDbBudgetDay(budgetDay))
      }
      return initialCal
    }
    return undefined
  },

  loadUserData: async (): Promise<UserData | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      const snapshot = await get(ref(db, `users/${userId}`))
      const value = snapshot.val()
      if (value) {
        return mappers.userFromDatabaseResponse(value)
      }
    }
    return undefined
  },

  updateUserName: async (name: string): Promise<string | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      const docRef = ref(db, `users/${userId}`)
      await update(docRef, {
        name,
      })
      return name
    }
    return undefined
  },

  addHabit: async (habit: Habit): Promise<Habit | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      const retVal = await push(ref(db, `users/${userId}/habits`))
      habit.id = retVal.key!!
      set(retVal, habit)
      return habit
    }
    return undefined
  },

  updateUserHabits: async (habits: Habit[]): Promise<Habit[] | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      const docRef = ref(db, `users/${userId}`)
      await update(docRef, {
        habits: habits,
      })
    }
    return undefined
  },

  updateUserCalendar: async (date: HabitDay): Promise<HabitDay | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      const val = await ref(db, `users/${userId}/habitCalendar/${date.id}`)
      set(val, mappers.toDbHabitDay(date))
      return date
    }
    return undefined
  },

  loadAdditionalDays: async (daysToAdd: HabitDay[]): Promise<HabitDay[] | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      for (const habitDay of daysToAdd) {
        const retVal = await push(ref(db, `users/${userId}/habitCalendar`))
        habitDay.id = retVal.key!!
        set(retVal, mappers.toDbHabitDay(habitDay))
      }
      return daysToAdd
    }
    return undefined
  },

  getUserDays: async (): Promise<HabitDay[] | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      const snapshot = await get(ref(db, `users/${userId}/habitCalendar`))
      const value = snapshot.val()
      if (value) {
        const userDaysIncomplete = mappers.flattenToArray<HabitDay>(value)
        const userDays = mappers.completeHabitCalendarMapping(userDaysIncomplete)
        return userDays
      }
    }
    return undefined
  },
}
