<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
import Settings from "@/components/Settings/Settings.vue"
import Loading from "./components/Loading/Loading.vue"
import { useUserStore } from "@/stores/user"
</script>

<template>
  <Loading :show-loading="loading" />
  <Settings />
  <RouterView />
</template>

<script lang="ts">
export default {
  data() {
    return {
      loading: true,
    }
  },
  mounted() {
    const userStore = useUserStore()
    this.loading = userStore.loading
    userStore.$subscribe((_, state) => {
      this.loading = state.loading
    })
  },
}
</script>
