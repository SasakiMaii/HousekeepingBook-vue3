<template>
  <main>
    <header class="bg-orange-100 p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="mr-6 text-3xl p-2">家計簿</h1>

      </div>
    </header>
    <section class="bg-gray-50 dark:bg-gray-900">
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      >
        <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
              class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center"
            >
              ログイン
            </h1>
            <form class="space-y-4 md:space-y-6" action="#">
              <div>
                <span v-for="(error, index) in errors" :key="index"
                  ><p v-if="error" class="text-red-400 text-xs text-center">
                    {{ error }}
                  </p></span
                >
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >メールアドレス</label
                >
                <input
                  type="email"
                  name="email"
                  id="email"
                  v-model="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="test@test.com"
                />
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >パスワード</label
                >
                <input
                  type="password"
                  name="password"
                  id="password"
                  v-model="password"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <button
                @click.prevent="login"
                class="w-full text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                ログイン
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                新規登録画面はこちら→
                <router-link
                  to="/register"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >新規登録</router-link
                >
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// import { useStoreUser } from "../stores/user";
// const userData = useStoreUser();

const email = ref("");
const password = ref("");
const users = ref([]);
const errors = ref([]);

const router = useRouter();

const login = async () => {
  errors.value = [];
  const response = await fetch("http://localhost:8008/register");
  const info = await response.json();
  users.value = info;

  const Match = users.value.filter((user) => {
    return user.email === email.value && user.password === password.value;
  });

  const name = Match.map((user) => {
    return user.name;
  });

  const err =
    "メールアドレス、またはパスワードが違います。再度確認して入力してください。";

  if (Match.length === 1 && !errors.value.length) {
    // pinia使用
    // userData.$patch({
    //   name: name,
    //   email: email.value,
    //   password: password.value,
    // });
    const userData = {
      name: name,
      email: email.value,
      password: password.value,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    router.push({ name: "TopView", force: true });
  } else {
    errors.value.push(err);
  }
};
</script>
