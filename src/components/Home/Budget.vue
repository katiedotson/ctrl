<template>
  <div>
    <h2 @click="budgetClicked">Budget<span>&rarr;</span></h2>
    <ul>
      <li v-for="category in categories" v-bind:key="category.id">{{ category.name }}</li>
    </ul>
  </div>
</template>
<script lang="ts">
import type { BudgetCategory } from "@/types/types"
import { useBudgetStore } from "@/stores/budget-categories"
export default {
  data() {
    return {
      categories: [] as BudgetCategory[],
    }
  },
  mounted() {
    const budgetCategoryStore = useBudgetStore()
    this.categories = budgetCategoryStore.categories
    budgetCategoryStore.$subscribe((_, state) => {
      this.categories = state.categories
    })
  },
  methods: {
    budgetClicked() {
      this.$emit("budgetClicked")
    },
  },
}
</script>
<style scoped>
h2 {
  color: var(--color-heading);
  margin-top: 1em;
  font-size: 1rem;
  cursor: pointer;
}
h2:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
h2 span {
  display: none;
}
h2:hover span {
  display: inline-block;
  margin-left: 8px;
}
#habits-box {
  color: var(--color-heading);
}
</style>
