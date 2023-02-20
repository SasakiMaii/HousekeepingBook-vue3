<template>
  <span v-if="localStorages">
    <button
      class="shadow-lg bg-orange-300 shadow-orange-300/50 text-black rounded px-2 py-1 ml-8"
      @click="logout"
    >
      ログアウト
    </button>
  </span>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const localStorages = localStorage.length >= 1;
const logout = () => {
  if (localStorage.length >= 1) {
    localStorage.clear();
    alert("ログアウトしました");
    router.push({ name: "LoginView", force: true });
  } else {
    console.log("ログインしてください");
  }
};
</script>

<style></style>
