<template>
  <div>
    <h1>Category Name: {{ newCategory.name }}</h1>
    <hr />
    <label for="checkIcon">Name</label>
    <input type="text" id="name" name="name" v-model="newCategory.name" />
    <label for="checkIcon">Icon HTML</label>
    <input type="text" id="checkIcon" name="checkIcon" v-model="newCategory.icon" />
    <div class="buttons">
      <button @click="saveNewCategory">Save</button>
    </div>
  </div>
</template>
<script lang="ts">
import type { BudgetCategory } from "@/types/types"
export default {
  props: {
    newCategoryProp: {
      type: Object as () => BudgetCategory,
      required: true,
    },
  },
  data() {
    return {
      newCategory: {} as BudgetCategory,
    }
  },
  mounted() {
    this.newCategory = this.$props.newCategoryProp
  },
  methods: {
    saveNewCategory() {
      this.$emit("saveNewCategory", this.newCategory)
    },
  },
}
</script>
