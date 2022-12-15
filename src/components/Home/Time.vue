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
      return DateTime.fromMillis(this.$props.currentTime).toLocaleString(
        DateTime.DATE_FULL
      )
    },
    formattedTime() {
      return DateTime.fromMillis(this.$props.currentTime).toFormat("hh:mm:ss a")
    },
  },
}
</script>
<style scoped>
#date {
  font-family: "Marck Script", cursive;
  padding: 1rem;
  font-size: 3rem;
  color: var(--color-heading);
}
#time {
  font-family: "VT323", monospace;
  padding: 1rem;
  font-size: 3rem;
  color: var(--color-heading);
}
</style>
