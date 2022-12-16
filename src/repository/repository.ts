import type { AppDay } from "@/stores/calendar"
import type { Habit } from "@/stores/habits"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  setDoc,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore"
import type { FirestoreDataConverter } from "firebase/firestore"
import config from "./config"
import { localRepo } from "./local"

const firebaseConfig = config

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const userDataConverter: FirestoreDataConverter<UserData> = {
  toFirestore: (userData: UserData): UserData => {
    return userData
  },
  fromFirestore: (snapshot, options): UserData => {
    const userData = snapshot.data(options)
    return {
      userId: userData.userId,
      name: userData.name,
      habits: userData.habits,
      calendar: userData.calendar.map((response: any) => {
        return {
          habitsCompleted: response.habitsCompleted,
          date: response.date.toDate(),
        }
      }),
    }
  },
}

export default {
  addUser: async (user: UserData): Promise<UserData | undefined> => {
    try {
      await setDoc(doc(db, "users", user.userId), user)
      return user
    } catch (error) {
      console.error(error)
    }
    return undefined
  },
  loadUserData: async (): Promise<UserData | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      try {
        const result = await getDoc(
          doc(db, "users", userId).withConverter(userDataConverter)
        )
        return result.data() as UserData
      } catch (error) {
        console.error(error)
      }
    }
    return undefined
  },
  updateUserName: async (name: string): Promise<string | undefined> => {
    const userId = localRepo.loadUserId()
    if (userId) {
      const docRef = doc(db, "users", userId)
      await updateDoc(docRef, {
        name,
      })
      return name
    }
  },
}

export interface UserData {
  userId: string
  calendar: AppDay[]
  habits: Habit[]
  name: string
}
