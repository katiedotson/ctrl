export const localRepo = {
  loadUserId(): string | null {
    return localStorage.getItem(keys.userId)
  },
  saveAuthToken(token: string) {
    localStorage.setItem(keys.token, token)
  },
  saveUid(uid: string) {
    localStorage.setItem(keys.userId, uid)
  },
  clearAuth() {
    localStorage.removeItem(keys.userId)
    localStorage.removeItem(keys.token)
  },
}

const keys = {
  userId: "USER_ID",
  token: "TOKEN",
}
