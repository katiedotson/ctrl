import { defineStore } from "pinia"
import repository from "@/repository/repository"
import { getAuth, signOut, type OAuthCredential, type UserCredential } from "firebase/auth"
import { localRepo } from "@/repository/local"
import { useHabitCalendarStore } from "./habit-calendar"
import { useHabitsStore } from "./habits"
import type { UserData } from "@/types/types"
import { useBudgetCalendarStore } from "./budget-calendar"
import { useBudgetStore } from "./budget-categories"

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
        })
        .catch((err) => {
          this.$state.loading = false
          console.error(err)
        })
    },
    async loadUserDataFromCache() {
      this.$state.loading = true
      repository
        .loadUserData()
        .then((userData: UserData | undefined) => {
          this.$state.loading = false
          if (userData) {
            this.loadExistingUserData(userData)
          } else {
            this.errorLoadingUser()
          }
        })
        .catch((error) => {
          this.errorLoadingUser()
          console.error(error)
        })
    },
    async loadUserData(credential: OAuthCredential, result: UserCredential | null) {
      this.$state.loading = true
      const token = credential.accessToken
      localRepo.saveAuthToken(token!!)
      localRepo.saveUid(result!!.user.uid)

      repository
        .loadUserData()
        .then((userData: UserData | undefined) => {
          if (userData) {
            this.$state.loading = false
            this.loadExistingUserData(userData)
          } else {
            this.createUser(result!!.user.uid, result!!.user.displayName)
          }
        })
        .catch((error) => {
          this.errorLoadingUser()
          console.error(error)
        })
    },
    errorLoadingUser() {
      this.$state.loading = false
      const calendarStore = useHabitCalendarStore()
      const habitsStore = useHabitsStore()
      calendarStore.errorLoadingData()
      habitsStore.errorLoadingData()
    },
    loadExistingUserData(user: UserData) {
      this.$state.name = user.name
      const calendarStore = useHabitCalendarStore()
      const habitsStore = useHabitsStore()
      calendarStore.setUserCalendar(user.habitCalendar)
      habitsStore.setUserHabits(user.habits)
    },
    createUser(userId: string, userName: string | null) {
      repository
        .addUser({
          userId: userId,
          habitCalendar: [],
          habits: [],
          budgetCalendar: [],
          budgetCategories: [],
          name: userName ?? "",
        })
        .then((data: UserData | undefined) => {
          this.$state.loading = false
          if (data) {
            const habitCalendarStore = useHabitCalendarStore()
            const habitsStore = useHabitsStore()
            const budgetCalendarStore = useBudgetCalendarStore()
            const budgetStore = useBudgetStore()

            habitsStore.initialize()
            habitCalendarStore.initialize()
            budgetStore.initialize()
            budgetCalendarStore.initialize()

            this.$state.name = data.name
          } else {
            this.errorLoadingUser()
          }
        })
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
