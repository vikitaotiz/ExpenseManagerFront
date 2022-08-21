import { defineStore } from "pinia";
import { storageId, baseUrl, headers } from "src/utilities/constants";

const auth = localStorage.getItem(storageId);

export const useUserStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(auth) || null,
  }),

  actions: {
    setUser(data) {
      this.user = data;
    },

    async loginRegister(data, url) {
      const res = await fetch(`${baseUrl}/${url}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      const result = await res.json();
      return result;
    },

    async logout() {
      const auth = localStorage.getItem(storageId);

      if (auth) {
        headers.Authorization = `Bearer ${JSON.parse(auth)?.token}`;
        const res = await fetch(`${baseUrl}/logout`, {
          method: "POST",
          headers,
        });

        const result = await res.json();
        this.user = null;
        localStorage.removeItem(storageId);
        return result;
      } else {
        return "User is not authorized.";
      }
    },
  },
});
