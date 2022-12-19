import type { AppDay, DbAppDay, DbUserData, Habit, UserData } from "@/types/types"
import { initializeApp } from "firebase/app"
import { get, getDatabase, push, ref, set, update } from "firebase/database"
import config from "./config"
import { localRepo } from "./local"

const firebaseConfig = config

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export default {
  addUser: async (user: UserData): Promise<UserData | undefined> => {
    if (user.userId) {
      await set(ref(db, `users/${user.userId}`), toDbUser(user))
      return user
    }
    return undefined
  },
  initializeCalendar: async (initialCal: AppDay[]): Promise<AppDay[] | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      for (const appDay of initialCal) {
        const retVal = await push(ref(db, `users/${userId}/calendar`))
        set(retVal, toDbAppDay(appDay))
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
        return fromDatabaseResponse(value)
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
  },
  updateUserHabits: async (habits: Habit[]): Promise<void> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      const docRef = ref(db, `users/${userId}`)
      await update(docRef, {
        habits: habits,
      })
    }
  },
}

const toDbUser = (userData: UserData): DbUserData => {
  return {
    userId: userData.userId,
    calendar: userData.calendar.map((appDay) => {
      return toDbAppDay(appDay)
    }),
    habits: userData.habits,
    name: userData.name,
  }
}

const toDbAppDay = (appDay: AppDay): DbAppDay => {
  return {
    habitsCompleted: [],
    date: appDay.date.toUTCString(),
  }
}
const fromDatabaseResponse = (userResponse: any): UserData => {
  console.log("db response: ", userResponse)
  const userData = {
    name: userResponse.name,
    userId: userResponse.userId,
    calendar: flattenToArray<AppDay>(userResponse.calendar),
    habits: flattenToArray<Habit>(userResponse.habits),
  }
  console.log("userData from response,", userData)
  return userData
}

interface Id {
  id: string
}

function flattenToArray<T extends Id>(objectIn: any): T[] {
  var arrayOut: T[] = []
  for (const key in objectIn) {
    const obj = objectIn[key]
    obj.id = key
    arrayOut.push(obj)
  }
  return arrayOut
}
