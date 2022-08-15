import { defineStore } from "pinia";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [],
  }),

  actions: {
    setCategories(data) {
      // this.categories = data?.map((val) => val.title);
    },
  },
});
