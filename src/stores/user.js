import { defineStore } from "pinia";

export const useStoreUser = defineStore("user", {
  state: () => ({
    name: "",
    email: "",
    password: "",
  }),
  persist: true,
});
