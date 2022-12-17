<template>
  <section>
    <h1>Habit Name: {{ habitName }}</h1>
    <hr />
    <label for="checkIcon">Name</label>
    <input type="text" id="name" name="name" v-model="habitName" />
    <label for="checkIcon">Icon HTML</label>
    <input type="text" id="checkIcon" name="checkIcon" v-model="checkIcon" />
    <div class="buttons">
      <button class="delete" @click="deleteHabit">Delete</button>
      <button @click="saveUpdates">Save</button>
    </div>
  </section>
</template>
<script lang="ts">
import { useHabitsStore } from "@/stores/habits"
import type { Habit } from "@/types/types"
export default {
  props: {
    habitProp: {
      type: Object as () => Habit,
      required: true,
    },
  },
  mounted() {
    this.checkIcon = this.$props.habitProp.checkIcon
    this.id = this.$props.habitProp.id
    this.habitName = this.$props.habitProp.name
  },
  methods: {
    saveUpdates() {
      const habitsStore = useHabitsStore()
      habitsStore.saveHabitUpdates(this.id, this.habitName, this.checkIcon)
      this.$emit("modalClosed")
    },
    deleteHabit() {
      const habitsStore = useHabitsStore()
      habitsStore.deleteHabit(this.id)
      this.$emit("modalClosed")
    },
  },
  data() {
    return {
      checkIcon: "",
      id: "",
      habitName: "",
    }
  },
}
</script>
