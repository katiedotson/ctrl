<template>
  <div>
    <div class="Rtable Rtable--3cols Rtable--collapse-hide">
      <div class="Rtable-cell">Category</div>
      <div class="Rtable-cell">Notes</div>
      <div class="Rtable-cell" style="text-align: right">Cost</div>
    </div>
    <div class="Rtable Rtable--3cols Rtable--collapse" v-for="entry in entries" v-bind:key="entry.id" @click="onClicked(entry, date)">
      <div class="Rtable-cell" v-html="getCategoryDisplayText(entry.category)"></div>
      <div class="Rtable-cell">{{ entry.notes }}</div>
      <div class="Rtable-cell" style="text-align: right">{{ entry.cost }}</div>
    </div>
    <div class="Rtable Rtable--3cols Rtable--collapse">
      <div class="Rtable-cell"></div>
      <div class="Rtable-cell"></div>
      <div class="Rtable-cell" style="text-align: right" v-html="getTotal"></div>
    </div>
  </div>
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
    date: {
      type: Date,
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
    onClicked(entry: BudgetEntry, date: Date) {
      this.$emit("entryClicked", entry, date)
    },
  },
  computed: {
    getTotal(): string {
      return (
        "Total: " +
        this.$props.entries
          .map((entry) => {
            return entry.cost
          })
          .reduce((accumulator, current) => {
            return Number(accumulator) + Number(current)
          }, 0)
          .toFixed(2)
          .toString()
      )
    },
  },
}
</script>
<style scoped>
.Rtable {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 1em 0;
  padding: 0;
}
.Rtable-cell {
  box-sizing: border-box;
  flex-grow: 1;
  width: 100%;
  padding: 0.8em 0;
  overflow: hidden;
  list-style: none;
}
.Rtable--3cols > .Rtable-cell {
  width: 33.33%;
}
.Rtable {
  position: relative;
  top: 3px;
  left: 3px;
  border-block-end: 1px solid var(--color-border);
}
.Rtable-cell {
  margin: -3px 0 0 -3px;
}
@media all and (max-width: 500px) {
  .Rtable--collapse {
    display: block;
  }
  .Rtable--collapse > .Rtable-cell {
    width: 100% !important;
  }
  .Rtable--collapse-hide {
    display: none;
  }
}
</style>
