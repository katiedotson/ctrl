<script setup lang="ts">
import Modal from "@/components/Modal/Modal.vue"
import AddBudgetCategory from "@/components/Budget/AddBudgetCategory.vue"
import AddBudgetEntry from "@/components/Budget/AddBudgetEntry.vue"
import EditBudgetCategories from "@/components/Budget/EditBudgetCategories.vue"
import Datepicker from "@vuepic/vue-datepicker"
</script>
<template>
  <section>
    <h1>Budget</h1>
    <div class="buttons">
      <button @click="editBudgetCategories">Edit categories</button>
      <button @click="addNewBudgetCategory">Add a category</button>
    </div>
    <Datepicker v-model="date" @update:modelValue="handleDateChange" range dark />
    <div v-for="day in calendar" v-bind:key="day.id">
      <h3 v-if="day.entries && day.entries.length > 0">{{ getDateFormatted(day.date) }}</h3>
      <hr v-if="day.entries && day.entries.length > 0" />
      <budget-day-table v-if="day.entries && day.entries.length > 0" :entries="day.entries" :categories="budgetCategories" />
    </div>
    <div class="buttons">
      <button class="icon-btn" @click="addBudgetEntry"><span class="material-icons"> add </span>New entry</button>
    </div>
    <!-- Add Budget Entry Item Modal -->
    <Modal v-if="budgetEntryItem" @close-modal="closeBudgetEntryModal">
      <template v-slot:title> New budget entry </template>
      <template v-slot:content>
        <AddBudgetEntry :show-date="true" @save-new-entry="saveNewBudgetEntry" :budget-entry-prop="budgetEntryItem" :budget-categories-prop="budgetCategories" />
      </template>
    </Modal>
    <!-- Add new category modal -->
    <Modal v-if="newBudgetCategory" @close-modal="closeNewCategoryModal">
      <template v-slot:title> Add a new category </template>
      <template v-slot:content>
        <AddBudgetCategory :newCategoryProp="newBudgetCategory" @save-new-category="saveNewCategory" />
      </template>
    </Modal>
    <!-- Edit categories modal -->
    <Modal v-if="editBudgetCategory" @close-modal="closeEditCategoryModal">
      <template v-slot:title> Edit categories </template>
      <template v-slot:content>
        <EditBudgetCategories :categories="budgetCategories" @done-editing-categories="closeEditCategoryModal" />
      </template>
    </Modal>
  </section>
</template>
<script lang="ts">
import { useBudgetStore } from "@/stores/budget-categories"
import type { BudgetCategory, BudgetDay, BudgetEntry } from "@/types/types"
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
      editBudgetCategory: false,
      budgetEntryItem: undefined as BudgetEntry | undefined,
      date: [] as Date[],
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
    editBudgetCategories() {
      this.editBudgetCategory = true
    },
    closeEditCategoryModal() {
      this.editBudgetCategory = false
    },
    addBudgetEntry() {
      this.budgetEntryItem = { id: "", category: "", cost: 0, notes: "" }
    },
    closeBudgetEntryModal() {
      this.budgetEntryItem = undefined
    },
    saveNewBudgetEntry(entry: BudgetEntry, date: Date) {
      const budgetCalendarStore = useBudgetCalendarStore()
      budgetCalendarStore.addBudgetEntryForDate(entry, date)
      this.closeBudgetEntryModal()
    },
    handleDateChange(dates: any) {
      const budgetCalendarStore = useBudgetCalendarStore()
      budgetCalendarStore.changeDateRange(dates[0] as Date, dates[1] as Date)
    },
  },
  mounted() {
    const budgetCategoryStore = useBudgetStore()
    this.budgetCategories = budgetCategoryStore.categories
    budgetCategoryStore.$subscribe((_, state) => {
      this.budgetCategories = state.categories
    })

    const budgetCalendarStore = useBudgetCalendarStore()
    this.calendar = budgetCalendarStore.calendar
    budgetCalendarStore.$subscribe((_, state) => {
      this.calendar = state.calendar
      this.date = [state.startDate, state.endDate]
    })
    this.date.push(budgetCalendarStore.startDate)
    this.date.push(budgetCalendarStore.endDate)
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
