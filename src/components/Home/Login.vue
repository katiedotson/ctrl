<template>
  <section>
    <div>Welcome to Ctrl</div>
    <div id="animation"></div>
    <button @click="signInClicked">Sign In</button>
  </section>
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
<style scoped>
#animation {
  margin: 40px auto;
  width: 100px;
  height: 100px;
  position: relative;
  box-shadow: 0 0 30px #00ff7f;
  background-color: rgb(255, 132, 0);
  animation-name: example;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
@keyframes example {
  0% {
    box-shadow: 0 0 30px #8ec0a7;
    background-color: rgb(255, 132, 0);
  }
  25% {
    box-shadow: 0 0 20px #00ff7f;
    background-color: rgb(0, 255, 157);
  }
  50% {
    box-shadow: 0 0 30px #00ff7f;
    background-color: rgb(0, 123, 255);
  }
  75% {
    box-shadow: 0 0 20px #00ff7f;
    background-color: rgb(91, 200, 91);
  }
  100% {
    box-shadow: 0 0 30px #00ff7f;
    background-color: (255, 132, 0);
  }
}
div {
  text-align: center;
  margin-bottom: 3em;
}
button {
  display: block;
  margin: auto;
  background-color: #33ffbd;
  border: none;
  color: black;
  padding: 16px 32px;
  text-decoration: none;
  margin-top: 16px;
  margin-bottom: 16px;
  cursor: pointer;
}
</style>
