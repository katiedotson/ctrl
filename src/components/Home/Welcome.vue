<template>
  <div>Welcome, {{ name }}</div>
</template>
<script lang="ts">
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>
<style scoped>
div {
  font-size: 2rem;
  color: var(--color-heading);
}
</style>
