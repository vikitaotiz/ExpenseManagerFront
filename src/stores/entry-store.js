import { defineStore } from "pinia";
const entryStoreName = "exp-entries";

const entry = localStorage.getItem(entryStoreName);

export const useEntryStore = defineStore("today_entries", {
  state: () => ({
    today_entries: JSON.parse(entry)?.entries || 0,
  }),

  actions: {
    addEntry() {
      this.today_entries = this.today_entries + 1;
      localStorage.setItem(
        entryStoreName,
        JSON.stringify({ entries: this.today_entries })
      );
    },

    clearEntry() {
      this.today_entries = 0;
      localStorage.removeItem(entryStoreName);
    },
  },
});
