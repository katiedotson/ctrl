import repository from "@/repository/repository"
import type { BudgetCategory } from "@/types/types"
import { defineStore } from "pinia"

export const useBudgetStore = defineStore("budget-categories", {
  state: () => ({
    categories: [] as BudgetCategory[],
    loading: true,
  }),
  actions: {
    initialize() {
      const categories = this.initialCategories()
      repository
        .initializeBudgetCategories(categories)
        .then((res) => {
          if (res) {
            this.setCategories(res)
          } else {
            throw Error("No response from API")
          }
        })
        .catch((err) => {
          console.error(err)
          this.loading = false
        })
    },

    initialCategories(): BudgetCategory[] {
      return [
        {
          id: "",
          name: "Food",
          icon: "&#128164;",
        },
      ]
    },

    setCategories(categories: BudgetCategory[]) {
      this.categories = categories
      this.loading = false
    },

    saveNewCategory(category: BudgetCategory) {
      console.log(category)
    },
  },
})
