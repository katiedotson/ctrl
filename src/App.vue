<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>
<script lang="ts">
import { useCalendarStore } from "./stores/calendar";
import repository from "./repository/repository";
export default {
  beforeCreate() {
    repository.addUser({
      name: "Katie D.",
      calendar: [
        {
          date: new Date("2022-12-06"),
          habitsCompleted: ["0", "1", "3"],
        },
        {
          date: new Date("2022-12-07"),
          habitsCompleted: ["0", "3"],
        },
        {
          date: new Date("2022-12-08"),
          habitsCompleted: ["3"],
        },
        {
          date: new Date("2022-12-09"),
          habitsCompleted: ["1"],
        },
        {
          date: new Date("2022-12-10"),
          habitsCompleted: ["0", "1", "2", "3"],
        },
        {
          date: new Date("2022-12-11"),
          habitsCompleted: ["0", "1", "3"],
        },
        {
          date: new Date("2022-12-12"),
          habitsCompleted: ["0"],
        },
        {
          date: new Date("2022-12-13"),
          habitsCompleted: ["0", "1", "3"],
        },
        {
          date: new Date("2022-12-14"),
          habitsCompleted: ["0", "3"],
        },
        {
          date: new Date("2022-12-15"),
          habitsCompleted: [],
        },
        {
          date: new Date("2022-12-16"),
          habitsCompleted: [],
        },
        {
          date: new Date("2022-12-17"),
          habitsCompleted: [],
        },
        {
          date: new Date("2022-12-18"),
          habitsCompleted: [],
        },
        {
          date: new Date("2022-12-19"),
          habitsCompleted: [],
        },
      ],
      habits: [
        {
          name: "Food",
          id: "0",
          checkIcon: "&#129379;",
        },
        { name: "OTF", id: "1", checkIcon: "&#128170;" },
        { name: "Meditate", id: "2", checkIcon: "&#9889;" },
        { name: "Read", id: "3", checkIcon: "&#128218;" },
        { name: "Learn", id: "4", checkIcon: "&#127891;" },
        { name: "Water", id: "5", checkIcon: "&#9889;" },
        { name: "Stretch", id: "6", checkIcon: "&#9889;" },
      ],
    });

    const calendarStore = useCalendarStore();
    calendarStore.initialize();
  },
};
</script>
