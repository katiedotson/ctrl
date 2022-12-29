<template>
  <div>
    <hr />
    <label for="category">Category</label>
    <select id="category" name="category" v-model="category">
      <option v-for="category in categories" v-bind:value="category">{{ category.name }} {{ category.icon }}</option>
    </select>
    <label for="checkIcon">Name</label>
    <input type="text" id="name" name="name" v-model="category.name" />
    <label for="checkIcon">Icon HTML</label>
    <input type="text" id="checkIcon" name="checkIcon" v-model="category.icon" />
    <div class="buttons">
      <button @click="saveCategory">Save</button>
    </div>
  </div>
</template>
<script lang="ts">
import type { BudgetCategory } from "@/types/types"
export default {
  props: {
    categories: {
      type: Array as () => BudgetCategory[],
      required: true,
    },
  },
  data() {
    return {
      category: {} as BudgetCategory,
    }
  },
  methods: {
    saveCategory() {},
  },
}
</script>
<style scoped>
select {
  padding: 8px;
  width: 100%;
  border: none;
  font-family: "IBM Plex Mono";
}
</style>
