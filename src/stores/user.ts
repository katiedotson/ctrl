import { defineStore } from "pinia"

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "" as string,
  }),
  actions: {
    initialize(name: string) {
      console.log(name)
      this.$state.name = name
    },
  },
})
