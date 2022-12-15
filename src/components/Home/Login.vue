<template>
  <button @click="signInClicked">Sign In</button>
</template>
<script lang="ts">
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth"

export default {
  mounted() {
    this.provider = new GoogleAuthProvider()
    this.auth = getAuth()
  },
  data() {
    return {
      provider: {} as GoogleAuthProvider,
      auth: {} as any,
    }
  },
  methods: {
    signInClicked() {
      signInWithRedirect(this.auth, this.provider)
    },
  },
}
</script>
