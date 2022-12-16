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
import { useCalendarStore } from "./calendar"
import { useHabitsStore } from "./habits"

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
                calendar: [],
                habits: [],
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
    initialize(data: UserData) {
      const calendarStore = useCalendarStore()
      const habitsStore = useHabitsStore()
      calendarStore.initialize(data!!.calendar)
      habitsStore.initialize(data!!.habits)
      this.$state.name = data.name
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
