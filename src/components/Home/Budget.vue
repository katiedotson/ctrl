<script setup lang="ts">
import Modal from "@/components/Modal/Modal.vue"
import AddBudgetEntry from "@/components/Budget/AddBudgetEntry.vue"
</script>
<template>
  <div>
    <h2 @click="budgetClicked">Budget<span>&rarr;</span></h2>
    <table v-if="entries">
      <thead>
        <th scope="col">Notes</th>
        <th scope="col">Cost</th>
        <th scope="col">Category</th>
      </thead>
      <tbody>
        <tr v-for="entry in entries" v-bind:key="entry.id">
          <td>{{ entry.notes }}</td>
          <td>{{ entry.cost }}</td>
          <td>{{ entry.category }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>Nothing here yet.</div>
    <div class="buttons no-float">
      <button class="icon-btn" @click="addBudgetEntry"><span class="material-icons"> add </span>New entry</button>
    </div>
    <!-- Add Budget Entry Item Modal -->
    <Modal v-if="addBudgetEntryItem" @close-modal="closeBudgetEntryModal">
      <template v-slot:title> New budget entry </template>
      <template v-slot:content>
        <AddBudgetEntry @save-new-entry="saveNewBudgetEntry" :budget-entry-prop="addBudgetEntryItem" :budget-categories-prop="categories" />
      </template>
    </Modal>
  </div>
</template>
<script lang="ts">
import type { BudgetCategory, BudgetDay, BudgetEntry } from "@/types/types"
import { useBudgetStore } from "@/stores/budget-categories"
import { useBudgetCalendarStore } from "@/stores/budget-calendar"
export default {
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
      console.log(budgetEntry)
    },
    closeBudgetEntryModal() {
      this.addBudgetEntryItem = undefined
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
</style>