<template>
  <div id="habits-box">
    <h2 @click="budgetClicked">Budget<span>&rarr;</span></h2>
  </div>
</template>
<script lang="ts">
export default {
  methods: {
    budgetClicked() {
      this.$emit("budgetClicked")
    },
  },
}
</script>
<style scoped>
h2 {
  margin-top: 1em;
  font-size: 1rem;
  cursor: pointer;
}
h2:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
h2 span {
  display: none;
}
h2:hover span {
  display: inline-block;
  margin-left: 8px;
}
#habits-box {
  color: var(--color-heading);
}
</style>
