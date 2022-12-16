<script setup lang="ts">
import { useUserStore } from "@/stores/user"
import Modal from "../Modal/Modal.vue"
</script>

<template>
  <section>
    <ul class="settings-bar">
      <li>
        <button v-if="name" @click="settingsClicked" aria-label="Open settings">
          <span class="material-icons"> settings </span>
        </button>
      </li>
    </ul>
    <Modal v-if="settingsOpen" @close-modal="closeSettings">
      <template v-slot:title> Edit Settings </template>
      <template v-slot:content>
        <h4>Hey, {{ name }}. This is where you can update your info.</h4>
        <hr />
        <label for="checkIcon">Name</label>
        <input type="text" id="name" name="name" v-model="name" />
        <div class="buttons">
          <button @click="saveUpdates">Save</button>
        </div>
        <div class="buttons">
          <button v-if="name" @click="logout">Log Out</button>
        </div>
      </template>
    </Modal>
  </section>
</template>
<script lang="ts">
export default {
  mounted() {
    const userStore = useUserStore()
    this.name = userStore.name
    userStore.$subscribe((_, state) => {
      this.name = state.name
    })
  },
  data() {
    return {
      settingsOpen: false,
      name: "",
    }
  },
  methods: {
    settingsClicked() {
      this.settingsOpen = true
    },
    closeSettings() {
      this.settingsOpen = false
    },
    saveUpdates() {
      const userStore = useUserStore()
      userStore
        .updateUserName(this.name)
        .then((_) => {
          this.settingsOpen = false
        })
        .catch((err) => {
          console.error(err)
        })
    },
    logout() {
      const userStore = useUserStore()
      userStore
        .logout()
        .then((_) => {
          this.settingsOpen = false
        })
        .catch((err) => {
          console.error(err)
        })
    },
  },
}
</script>
<style scoped>
ul.settings-bar {
  width: 100%;
  background-color: var(--color-background);
  padding: 1em;
  position: sticky;
  height: 4em;
  display: flex;
  justify-content: end;
}

ul.settings-bar li {
  display: block;
  list-style-type: none;
  height: 1em;
}

ul.settings-bar li button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  height: min-content;
}

span {
  color: var(--color-heading);
}

hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
h4 {
  margin-top: 1.5em;
}
</style>
