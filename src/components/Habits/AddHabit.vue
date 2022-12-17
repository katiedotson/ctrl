<template>
  <div>
    <h1>Habit Name: {{ newHabit.name }}</h1>
    <hr />
    <label for="checkIcon">Name</label>
    <input type="text" id="name" name="name" v-model="newHabit.name" />
    <label for="checkIcon">Icon HTML</label>
    <input type="text" id="checkIcon" name="checkIcon" v-model="newHabit.checkIcon" />
    <div class="buttons">
      <button @click="saveNewHabit">Save</button>
    </div>
  </div>
</template>
<script lang="ts">
import type { Habit } from "@/types/types"
export default {
  methods: {
    saveNewHabit() {
      this.$emit("saveNewHabit", this.newHabit)
    },
  },
  data() {
    return {
      newHabit: {} as Habit,
    }
  },
  props: {
    newHabitProp: {
      type: Object as () => Habit,
      required: true,
    },
  },
  mounted() {
    this.newHabit = this.$props.newHabitProp
  },
}
</script>
