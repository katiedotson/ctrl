import type { AppDay, Habit, UserData } from "@/types/types"
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

  initializeCalendar: async (initialCal: AppDay[]): Promise<AppDay[] | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      for (const appDay of initialCal) {
        const retVal = await push(ref(db, `users/${userId}/calendar`))
        appDay.id = retVal.key!!
        set(retVal, mappers.toDbAppDay(appDay))
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

  updateUserCalendar: async (date: AppDay): Promise<AppDay | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      const val = await ref(db, `users/${userId}/calendar/${date.id}`)
      set(val, mappers.toDbAppDay(date))
      return date
    }
    return undefined
  },

  loadAdditionalDays: async (daysToAdd: AppDay[]): Promise<AppDay[] | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      for (const appDay of daysToAdd) {
        const retVal = await push(ref(db, `users/${userId}/calendar`))
        appDay.id = retVal.key!!
        set(retVal, mappers.toDbAppDay(appDay))
      }
      return daysToAdd
    }
    return undefined
  },

  getUserDays: async (): Promise<AppDay[] | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      const snapshot = await get(ref(db, `users/${userId}/calendar`))
      const value = snapshot.val()
      if (value) {
        const userDaysIncomplete = mappers.flattenToArray<AppDay>(value)
        const userDays = mappers.completeCalendarMapping(userDaysIncomplete)
        return userDays
      }
    }
    return undefined
  },
}
