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
import config from "./config"

const firebaseConfig = config

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

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
  loadUserData: async (userId: string): Promise<UserData | undefined> => {
    try {
      const result = await getDoc(doc(db, "users", userId))
      return result.data() as UserData
    } catch (error) {
      console.error(error)
    }
  },
}

interface UserData {
  calendar: AppDay[]
  habits: Habit[]
  name: string
}
