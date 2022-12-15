<template>
  <div v-if="showLoading" class="loading-background">
    <div class="clock-loader"></div>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    showLoading: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
<style scoped>
.loading-background {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 98vh;
  margin: 0;
  background: rgba(0, 0, 0, 0.859);
  width: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
}
.clock-loader {
  --clock-color: white;
  --clock-width: 4rem;
  --clock-radius: calc(var(--clock-width) / 2);
  --clock-minute-length: calc(var(--clock-width) * 0.4);
  --clock-hour-length: calc(var(--clock-width) * 0.2);
  --clock-thickness: 0.2rem;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--clock-width);
  height: var(--clock-width);
  border: 3px solid var(--clock-color);
  border-radius: 50%;
}

.clock-loader::before,
.clock-loader::after {
  position: absolute;
  content: "";
  top: calc(var(--clock-radius) * 0.25);
  width: var(--clock-thickness);
  background: var(--clock-color);
  border-radius: 10px;
  transform-origin: center calc(100% - calc(var(--clock-thickness) / 2));
  animation: spin infinite linear;
}

.clock-loader::before {
  height: var(--clock-minute-length);
  animation-duration: 2s;
}

.clock-loader::after {
  top: calc(var(--clock-radius) * 0.25 + var(--clock-hour-length));
  height: var(--clock-hour-length);
  animation-duration: 15s;
}

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
</style>
