import type { AppDay } from "@/stores/calendar"
import type { Habit } from "@/stores/habits"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
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
  async addUser(user: UserData) {
    try {
      await addDoc(collection(db, "users"), {
        calendar: user.calendar,
        habits: user.habits,
      })
    } catch (error) {
      console.error(error)
    }
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
}

export interface UserData {
  calendar: AppDay[]
  habits: Habit[]
  name: string
}
