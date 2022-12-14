<template>
  <div class="back-arrow" @click="backClicked">&larr;</div>
</template>
<script lang="ts">
export default {
  methods: {
    backClicked() {
      this.$emit("backArrowClicked");
    },
  },
};
</script>
<style scoped>
div.back-arrow {
  width: min-content;
  font-size: 4rem;
  display: block;
  cursor: pointer;
}
div.back-arrow:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
</style>
