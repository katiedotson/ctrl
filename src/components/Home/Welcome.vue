<template>
  <div>Welcome, {{ name }}</div>
</template>
<script lang="ts">
import { useUserStore } from "@/stores/user"

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
      name: "" as string,
    }
  },
}
</script>
<style scoped>
div {
  padding: 1rem;
  font-size: 2rem;
  color: var(--color-heading);
}
</style>
