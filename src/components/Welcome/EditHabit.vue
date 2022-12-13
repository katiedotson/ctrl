<template>
  <section>
    <h1>Habit Name: {{ habitProp.name }}</h1>
    <hr />
    <label for="checkIcon">Name</label>
    <input type="text" id="name" name="name" v-model="name" />
    <label for="checkIcon">Icon HTML</label>
    <input type="text" id="checkIcon" name="checkIcon" v-model="checkIcon" />
    <div class="buttons">
      <button class="delete" @click="deleteHabit">Delete</button>
      <button @click="saveUpdates">Save</button>
    </div>
  </section>
</template>
<script>
import { useHabitsStore, Habit } from "@/stores/habits";
export default {
  props: {
    habitProp: Habit,
  },
  mounted() {
    this.checkIcon = this.$props.habitProp.checkIcon;
    this.id = this.$props.habitProp.id;
    this.name = this.$props.habitProp.name;
  },
  methods: {
    saveUpdates() {
      const habitsStore = useHabitsStore();
      habitsStore.saveHabitUpdates(this.id, this.name, this.checkIcon);
      habitsStore.showHabitModal("");
    },
    deleteHabit() {
      const habitsStore = useHabitsStore();
      habitsStore.deleteHabit(this.id);
      habitsStore.showHabitModal("");
    },
  },
  data() {
    return {
      checkIcon: "",
      id: "",
      name: "",
    };
  },
};
</script>
<style scoped>
input {
  width: 100%;
  padding: 8px;
}
hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
label {
  margin-top: 1rem;
  display: block;
}
.buttons {
  display: block;
  margin-left: auto;
  width: max-content;
}
.buttons button.delete {
  background-color: #c70039;
  color: white;
}
.buttons button {
  display: inline-block;
  background-color: #33ffbd;
  border: none;
  color: black;
  padding: 16px 32px;
  text-decoration: none;
  margin-top: 16px;
  margin-bottom: 16px;
  cursor: pointer;
}
.buttons :last-child {
  margin-left: 12px;
}
</style>
