import type { AppDay } from "@/stores/calendar";
import type { Habit } from "@/stores/habits";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import config from "./config";

const firebaseConfig = config;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default {
  async addUser(user: UserData) {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        calendar: user.calendar,
        habits: user.habits,
      });
      console.log(docRef);
    } catch (error) {
      console.error(error);
    }
  },
  loadUserData: () => <UserData>{},
};

interface UserData {
  calendar: AppDay[];
  habits: Habit[];
  name: string;
}
