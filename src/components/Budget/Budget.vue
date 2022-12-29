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
    <div v-for="day in calendar" v-bind:key="day.id">
      <h3 v-if="day.entries && day.entries.length > 0">{{ getDateFormatted(day.date) }}</h3>
      <hr v-if="day.entries && day.entries.length > 0" />
      <budget-day-table v-if="day.entries && day.entries.length > 0" :entries="day.entries" :categories="budgetCategories" />
    </div>
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
import type { BudgetCategory, BudgetDay } from "@/types/types"
import { useBudgetCalendarStore } from "@/stores/budget-calendar"
import { DateTime } from "luxon"
import BudgetDayTable from "./BudgetDayTable.vue"
export default {
  components: { BudgetDayTable },
  data() {
    return {
      budgetCategories: [] as BudgetCategory[],
      newBudgetCategory: undefined as BudgetCategory | undefined,
      calendar: [] as BudgetDay[],
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
    getDateFormatted(date: Date): string {
      return DateTime.fromJSDate(date).toFormat("yyyy.MM.dd")
    },
  },
  mounted() {
    const budgetCategoryStore = useBudgetStore()
    this.budgetCategories = budgetCategoryStore.categories
    budgetCategoryStore.$subscribe((_, state) => {
      this.budgetCategories = state.categories
    })

    const budgetCalendarStore = useBudgetCalendarStore()
    this.calendar = budgetCalendarStore.allDays
    budgetCalendarStore.$subscribe((_, state) => {
      this.calendar = state.allDays
    })
  },
}
</script>
<style scoped>
div.entry {
  margin-bottom: 20px;
}
table {
  width: 100%;
}
table td,
table th {
  text-align: left;
}
table th {
  font-weight: bolder;
  padding-bottom: 20px;
}
</style>
