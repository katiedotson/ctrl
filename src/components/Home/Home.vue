<script setup lang="ts">
import Habits from "@/components/Home/Habits.vue"
import Budget from "@/components/Home/Budget.vue"
import Time from "@/components/Home/Time.vue"
import Welcome from "@/components/Home/Welcome.vue"
import Login from "@/components/Home/Login.vue"
import Loading from "@/components/Loading/Loading.vue"
</script>

<template>
  <section v-if="user">
    <Welcome :name="user" />
    <Habits @habits-clicked="habitsTitleClicked" />
    <Budget @budget-clicked="budgetTitleClicked" />
    <Time :currentTime="currentTime" />
  </section>
  <section v-if="!user">
    <Login />
  </section>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/user"

export default {
  mounted() {
    // time
    setInterval(() => {
      this.updateTime()
    }, 1000)

    // user
    const userStore = useUserStore()
    this.user = userStore.name
    userStore.$subscribe((_, state) => {
      this.user = state.name
    })
  },
  methods: {
    updateTime() {
      this.currentTime = Date.now()
    },
    habitsTitleClicked() {
      this.$router.push("/habits")
    },
    budgetTitleClicked() {
      this.$router.push("/budget")
    },
  },
  data() {
    return {
      currentTime: Date.now(),
      user: "" as string,
    }
  },
}
</script>
