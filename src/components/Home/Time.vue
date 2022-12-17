<template>
  <div id="date">{{ formattedDate }}</div>
  <div id="time">{{ formattedTime }}</div>
</template>
<script lang="ts">
import { DateTime } from "luxon"
export default {
  props: {
    currentTime: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    formattedDate() {
      return DateTime.fromMillis(this.$props.currentTime).toLocaleString(DateTime.DATE_FULL)
    },
    formattedTime() {
      return DateTime.fromMillis(this.$props.currentTime).toFormat("hh:mm:ss a")
    },
  },
}
</script>
<style scoped>
#date {
  padding-top: 1em;
  font-family: "Marck Script", cursive;
  font-size: 3rem;
  color: var(--color-heading);
}
#time {
  padding-top: 1em;
  font-family: "VT323", monospace;
  font-size: 3rem;
  color: var(--color-heading);
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
</style>
