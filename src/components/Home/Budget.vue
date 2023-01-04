<script setup lang="ts">
import Modal from "@/components/Modal/Modal.vue"
import AddBudgetEntry from "@/components/Budget/AddBudgetEntry.vue"
</script>
<template>
  <div>
    <h1 @click="budgetClicked">Budget<span>&nbsp;&rarr;</span></h1>
    <budget-day-table v-if="entries" :entries="entries" :categories="categories" />
    <div v-else>Nothing here yet.</div>
    <div class="buttons">
      <button class="icon-btn" @click="addBudgetEntry"><span class="material-icons"> add </span>New entry</button>
    </div>
    <!-- Add Budget Entry Item Modal -->
    <Modal v-if="addBudgetEntryItem" @close-modal="closeBudgetEntryModal">
      <template v-slot:title> New budget entry </template>
      <template v-slot:content>
        <AddBudgetEntry :show-date="false" @save-new-entry="saveNewBudgetEntry" :budget-entry-prop="addBudgetEntryItem" :budget-categories-prop="categories" />
      </template>
    </Modal>
  </div>
</template>
<script lang="ts">
import type { BudgetCategory, BudgetDay, BudgetEntry } from "@/types/types"
import { useBudgetStore } from "@/stores/budget-categories"
import { useBudgetCalendarStore } from "@/stores/budget-calendar"
import BudgetDayTable from "../Budget/BudgetDayTable.vue"
export default {
  components: { BudgetDayTable },
  data() {
    return {
      categories: [] as BudgetCategory[],
      today: {} as BudgetDay,
      entries: [] as BudgetEntry[],
      addBudgetEntryItem: undefined as BudgetEntry | undefined,
    }
  },
  mounted() {
    const budgetCategoryStore = useBudgetStore()
    this.categories = budgetCategoryStore.categories
    budgetCategoryStore.$subscribe((_, state) => {
      this.categories = state.categories
    })

    const budgetCalendarStore = useBudgetCalendarStore()
    this.entries = budgetCalendarStore.currentDay.entries
    budgetCalendarStore.$subscribe((_, state) => {
      this.entries = state.currentDay.entries
    })
  },
  methods: {
    budgetClicked() {
      this.$emit("budgetClicked")
    },
    addBudgetEntry() {
      this.addBudgetEntryItem = {
        id: "",
        notes: "",
        cost: 0.0,
        category: "",
      }
    },
    saveNewBudgetEntry(budgetEntry: BudgetEntry) {
      const budgetCalendarStore = useBudgetCalendarStore()
      budgetCalendarStore.addBudgetEntryForDate(budgetEntry, new Date())
      this.closeBudgetEntryModal()
    },
    closeBudgetEntryModal() {
      this.addBudgetEntryItem = undefined
    },
    getCategoryDisplayText(categoryId: string): string {
      const category = this.categories.find((cat) => {
        return cat.id == categoryId
      })!!
      return category.name + " " + category.icon
    },
  },
}
</script>
<style scoped>
h1 {
  color: var(--color-heading);
  margin-top: 1em;
  font-size: 1.5rem;
  cursor: pointer;
  width: fit-content;
}
h1:hover {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
</style>
