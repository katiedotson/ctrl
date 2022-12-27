<script setup lang="ts">
import Budget from "@/components/Budget/Budget.vue"
import BackArrow from "../components/BackArrow/BackArrow.vue"
</script>

<template>
  <main>
    <BackArrow @back-arrow-clicked="navigateBack" />
    <Budget />
  </main>
</template>
<script lang="ts">
export default {
  methods: {
    navigateBack() {
      this.$router.back()
    },
  },
}
</script>
