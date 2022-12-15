export const localRepo = {
  loadUserId(): string | null {
    return localStorage.getItem(keys.userId)
  },
}

const keys = {
  userId: "USER_ID",
}
