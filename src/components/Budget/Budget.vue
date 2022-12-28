<script setup lang="ts">
import Modal from "@/components/Modal/Modal.vue"
import AddBudgetCategory from "@/components/Budget/AddBudgetCategory.vue"
</script>
<template>
  <section>
    <h1>Budget</h1>
    <div class="buttons">
      <button @click="addNewBudgetCategory">Add a category</button>
    </div>
    <h3>Categories:</h3>
    <ul>
      <li v-for="category in budgetCategories">{{ category.name }}</li>
    </ul>
    <!-- Add new category modal -->
    <Modal v-if="newBudgetCategory" @close-modal="closeNewCategoryModal">
      <template v-slot:title> Add a new category </template>
      <template v-slot:content>
        <AddBudgetCategory :newCategoryProp="newBudgetCategory" @save-new-category="saveNewCategory" />
      </template>
    </Modal>
  </section>
</template>
<script lang="ts">
import { useBudgetStore } from "@/stores/budget-categories"
import type { BudgetCategory } from "@/types/types"
export default {
  data() {
    return {
      budgetCategories: [] as BudgetCategory[],
      newBudgetCategory: undefined as BudgetCategory | undefined,
    }
  },
  methods: {
    addNewBudgetCategory() {
      this.newBudgetCategory = { id: "", name: "", icon: "✅" }
    },
    closeNewCategoryModal() {
      this.newBudgetCategory = undefined
    },
    saveNewCategory(newCategory: BudgetCategory) {
      const budgetCategoryStore = useBudgetStore()
      budgetCategoryStore.saveNewCategory(newCategory)
      this.closeNewCategoryModal()
    },
  },
  mounted() {
    const budgetCategoryStore = useBudgetStore()
    this.budgetCategories = budgetCategoryStore.categories
    budgetCategoryStore.$subscribe((_, state) => {
      this.budgetCategories = state.categories
    })
  },
}
</script>
