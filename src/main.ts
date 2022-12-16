import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"

import "./assets/main.css"

import { useUserStore } from "./stores/user"
import { getAuth, GoogleAuthProvider, getRedirectResult } from "firebase/auth"

const app = createApp(App)

app.use(createPinia())
app.use(router)

const userStore = useUserStore()
userStore.loadUserDataFromCache()

getRedirectResult(getAuth())
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result!!)!!

    const userStore = useUserStore()
    userStore.loadUserData(credential, result)
  })
  .catch((error) => {
    console.error(error)
  })

app.mount("#app")
