import type { AppDay, DbAppDay, DbUserData, Habit, Id, UserData } from "@/types/types"

export default {
  toDbAppDay(appDay: AppDay): DbAppDay {
    return {
      habitsCompleted: appDay.habitsCompleted,
      date: appDay.date.toUTCString(),
    }
  },

  userFromDatabaseResponse(userResponse: any): UserData {
    const userData = {
      name: userResponse.name,
      userId: userResponse.userId,
      calendar: this.flattenToArray<AppDay>(userResponse.calendar),
      habits: this.flattenToArray<Habit>(userResponse.habits),
    }
    if (userData.calendar) {
      userData.calendar = this.completeCalendarMapping(userData.calendar)
    }
    return userData
  },

  completeCalendarMapping(calendar: AppDay[]): AppDay[] {
    calendar.map((appDay) => {
      if (appDay && appDay.habitsCompleted == undefined) {
        appDay.habitsCompleted = []
      }
      if (appDay) {
        appDay.date = new Date(appDay.date)
      }
    })
    return calendar
  },

  toDbUser(userData: UserData): DbUserData {
    return {
      userId: userData.userId,
      calendar: userData.calendar.map((appDay) => {
        return this.toDbAppDay(appDay)
      }),
      habits: userData.habits,
      name: userData.name,
    }
  },

  flattenToArray<T extends Id>(objectIn: any): T[] {
    var arrayOut: T[] = []
    for (const key in objectIn) {
      const obj = objectIn[key]
      obj.id = key
      arrayOut.push(obj)
    }
    return arrayOut
  },
}
