import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"

import "./assets/main.css"

import { useCalendarStore } from "./stores/calendar"
import { useHabitsStore } from "./stores/habits"
import { useUserStore } from "./stores/user"
import repository from "./repository/repository"
import type { UserData } from "./repository/repository"
import { localRepo } from "@/repository/local"
import { getAuth, GoogleAuthProvider, getRedirectResult } from "firebase/auth"

const app = createApp(App)

app.use(createPinia())
app.use(router)

repository.loadUserData().then((userData: UserData | undefined) => {
  if (userData) {
    initialize(userData)
  }
})

getRedirectResult(getAuth())
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result!!)!!
    const token = credential.accessToken

    localRepo.saveAuthToken(token!!)
    localRepo.saveUid(result!!.user.uid)

    repository
      .addUser({
        userId: result!!.user.uid,
        calendar: [],
        habits: [],
        name: result!!.user.displayName ?? "",
      })
      .then((data: UserData | undefined) => {
        if (data) {
          initialize(data)
        }
      })
  })
  .catch((error) => {
    console.log(error)
  })

function initialize(data: UserData) {
  const calendarStore = useCalendarStore()
  const habitsStore = useHabitsStore()
  const userStore = useUserStore()
  calendarStore.initialize(data!!.calendar)
  habitsStore.initialize(data!!.habits)
  userStore.initialize(data!!.name)
}

app.mount("#app")
