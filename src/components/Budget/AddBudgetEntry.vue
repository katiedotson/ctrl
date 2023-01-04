<template>
  <div>
    <hr />
    <label for="category">Category</label>
    <select id="category" name="category" v-model="entryItem.category" v-bind:class="categoryClass()" v-on:blur="categoryIsDirty = true">
      <option v-for="category in budgetCategories" v-bind:value="category.id" v-bind:key="category.id">{{ category.name }} {{ category.icon }}</option>
    </select>
    <label for="cost">Cost</label>
    <input type="text" id="cost" name="cost" v-model="entryItem.cost" v-bind:class="costClass()" v-on:blur="costIsDirty = true" />
    <label for="notes">Notes</label>
    <input type="text" id="notes" name="notes" v-model="entryItem.notes" v-bind:class="notesClass()" v-on:blur="notesIsDirty = true" />
    <div class="buttons">
      <button @click="saveNewEntry">Save</button>
    </div>
  </div>
</template>
<script lang="ts">
import type { BudgetCategory, BudgetEntry } from "@/types/types"
export default {
  props: {
    budgetEntryProp: {
      type: Object as () => BudgetEntry,
      required: true,
    },
    budgetCategoriesProp: {
      type: Array as () => BudgetCategory[],
      required: true,
    },
  },
  mounted() {
    this.entryItem = this.$props.budgetEntryProp
    this.budgetCategories = this.$props.budgetCategoriesProp
  },
  data() {
    return {
      costIsDirty: false,
      categoryIsDirty: false,
      notesIsDirty: false,
      entryItem: {} as BudgetEntry,
      budgetCategories: [] as BudgetCategory[],
    }
  },
  methods: {
    saveNewEntry() {
      if (this.costIsDirty && this.notesIsDirty && this.categoryIsDirty && this.validateCost() && this.validateNotes() && this.validateCategory()) {
        this.$emit("saveNewEntry", this.entryItem)
      } else {
        // TODO show validation
      }
    },
    validateCost(): boolean {
      const regex = /^\d+(?:\.\d{0,2})$/
      if (!this.costIsDirty) return true
      if (this.entryItem.cost != undefined && this.entryItem.cost == 0) {
        return false
      }
      if (this.entryItem.cost != undefined && this.entryItem.cost.toString().match(regex)!!.length > 0) return true
      else return false
    },
    validateNotes(): boolean {
      if (this.notesIsDirty && this.entryItem && this.entryItem.notes != undefined && this.entryItem.notes.trim() == "") {
        return false
      }
      return true
    },
    validateCategory(): boolean {
      if (this.categoryIsDirty && this.entryItem && this.entryItem.category != undefined && !this.entryItem.category) {
        return false
      }
      return true
    },
    costClass(): string {
      if (this.validateCost()) return ""
      return "invalid"
    },
    notesClass(): string {
      if (this.validateNotes()) return ""
      return "invalid"
    },
    categoryClass(): string {
      if (this.validateCategory()) return ""
      return "invalid"
    },
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
.invalid {
  border: 1px solid red;
  box-shadow: 2px 4px 4px red;
}
</style>
