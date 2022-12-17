import type { UserData } from "@/repository/repository"
import { defineStore } from "pinia"
import repository from "@/repository/repository"
import {
  getAuth,
  signOut,
  type OAuthCredential,
  type UserCredential,
} from "firebase/auth"
import { localRepo } from "@/repository/local"
import { AppDay, useCalendarStore } from "./calendar"
import { Habit, useHabitsStore } from "./habits"
import { DateTime } from "luxon"

export const useUserStore = defineStore("user", {
  state: () => ({
    loading: false,
    name: "" as string,
  }),
  actions: {
    async logout(): Promise<void> {
      this.$state.loading = true
      return signOut(getAuth())
        .then(() => {
          localRepo.clearAuth()
          this.$state.name = ""
          this.$state.loading = false
          return
        })
        .catch((err) => {
          this.$state.loading = false
          console.error(err)
          return
        })
    },
    async loadUserDataFromCache() {
      this.$state.loading = true
      repository
        .loadUserData()
        .then((userData: UserData | undefined) => {
          this.$state.loading = false
          if (userData) {
            this.initialize(userData)
          }
        })
        .catch((error) => {
          this.$state.loading = false
          console.error(error)
        })
    },
    async loadUserData(
      credential: OAuthCredential,
      result: UserCredential | null
    ) {
      this.$state.loading = true
      const token = credential.accessToken
      localRepo.saveAuthToken(token!!)
      localRepo.saveUid(result!!.user.uid)

      repository
        .loadUserData()
        .then((userData: UserData | undefined) => {
          if (userData) {
            this.$state.loading = false
            this.initialize(userData)
          } else {
            repository
              .addUser({
                userId: result!!.user.uid,
                calendar: this.initialCalendar(),
                habits: this.initialHabit(),
                name: result!!.user.displayName ?? "",
              })
              .then((data: UserData | undefined) => {
                this.$state.loading = false
                if (data) {
                  this.initialize(data)
                }
              })
          }
        })
        .catch((error) => {
          this.$state.loading = false
          console.error(error)
        })

      return undefined
    },
    errorLoadingUser() {
      this.$state.loading = false
      const calendarStore = useCalendarStore()
      const habitsStore = useHabitsStore()
      calendarStore.errorLoadingData()
      habitsStore.errorLoadingData()
    },
    initialCalendar(): AppDay[] {
      const calendar: AppDay[] = []
      const lastMonday = DateTime.fromJSDate(new Date()).startOf("week")
      for (let index = 0; index < 7; index++) {
        calendar.push({
          date: lastMonday.plus({ days: index }).toJSDate(),
          habitsCompleted: [],
        })
      }
      return calendar
    },
    initialHabit(): Habit[] {
      return [
        {
          name: "Sleep at least 6 hours",
          id: "1",
          checkIcon: "&#128164;",
        },
      ]
    },
    initialize(data: UserData) {
      const calendarStore = useCalendarStore()
      const habitsStore = useHabitsStore()
      calendarStore.initialize(data!!.calendar)
      habitsStore.initialize(data!!.habits)
      this.$state.name = data.name
      this.$state.loading = false
    },
    async updateUserName(name: string): Promise<string | undefined> {
      this.$state.loading = true
      return repository
        .updateUserName(name)
        .then((result: string | undefined) => {
          this.$state.loading = false
          if (result) {
            this.$state.name = name
            return name
          } else return undefined
        })
        .catch((err) => {
          this.$state.loading = false
          console.error(err)
          return undefined
        })
    },
  },
})
