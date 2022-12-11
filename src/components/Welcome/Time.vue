<template>
  <div id="date">{{ formattedDate }}</div>
  <div id="time">{{ formattedTime }}</div>
</template>
<script lang="ts">
import moment from "moment";
export default {
  props: { currentTime: Number },
  data() {
    return {};
  },
  computed: {
    formattedDate() {
      return moment(this.$props.currentTime).format("MMMM Do, YYYY");
    },
    formattedTime() {
      return moment(this.$props.currentTime).format("h:mm:ssa");
    },
  },
};
</script>
<style scoped>
#date {
  font-family: "Marck Script", cursive;
  background: hsla(201, 100%, 50%, 0.1);
  padding: 1rem;
  font-size: 3rem;
  color: var(--color-heading);
}
#time {
  font-family: "VT323", monospace;
  background: hsla(160, 100%, 37%, 0.2);
  padding: 1rem;
  font-size: 3rem;
  color: var(--color-heading);
}
</style>
