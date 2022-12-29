<template>
  <table v-if="entries">
    <thead>
      <th scope="col">Notes</th>
      <th scope="col" class="cost-col-header">Cost</th>
      <th scope="col">Category</th>
    </thead>
    <tbody>
      <tr v-for="entry in entries" v-bind:key="entry.id">
        <td>{{ entry.notes }}</td>
        <td class="cost-col">{{ entry.cost }}</td>
        <td v-html="getCategoryDisplayText(entry.category)"></td>
      </tr>
      <tr>
        <td></td>
        <td class="cost-col">Total: 300.00</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import type { BudgetCategory, BudgetEntry } from "@/types/types"
export default {
  props: {
    entries: {
      type: Array as () => BudgetEntry[],
      required: true,
    },
    categories: {
      type: Array as () => BudgetCategory[],
      required: true,
    },
  },
  methods: {
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
table {
  border-collapse: collapse;
  width: 100%;
}

table td,
table th {
  padding: 8px;
}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  border-block-end: 1px solid var(--color-heading);
}

.cost-col {
  text-align: right;
  padding-right: 32px;
}

.cost-col-header {
  width: 200px;
  word-wrap: break-word;
}
</style>
