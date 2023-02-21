<template>
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
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            新規登録
          </h1>
          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label
                for="text"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >名前(任意)</label
              >
              <input
                type="text"
                name="text"
                id="text"
                v-model="name"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >メールアドレス</label
              >
              <span v-for="(emailerror, index) in emailerrors" :key="index"
                ><p v-if="emailerror" class="text-red-400 text-xs">
                  {{ emailerror }}
                </p></span
              >
              <span
                v-for="(duplicationerror, index) in duplicationerrors"
                :key="index"
                ><p v-if="duplicationerror" class="text-red-400 text-xs">
                  {{ duplicationerror }}
                </p></span
              >
              <span
                v-for="(emailFormaterr, index) in emailFormaterrs"
                :key="index"
                ><p v-if="emailFormaterr" class="text-red-400 text-xs">
                  {{ emailFormaterr }}
                </p></span
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
              <span v-for="(error, index) in errors" :key="index"
                ><p v-if="error" class="text-red-400 text-xs">
                  {{ error }}
                </p></span
              >
              <span v-for="(passerror, index) in passerrors" :key="index"
                ><p v-if="passerror" class="text-red-400 text-xs">
                  {{ passerror }}
                </p></span
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
              type="submit"
              @click.prevent="register"
              class="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              新規登録
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              アカウントをお持ちの場合はこちら→
              <router-link
                to="/login"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >ログイン</router-link
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const name = ref("");
const email = ref("");
const password = ref("");
const kakeiboDatas = ref([]);
const errors = ref([]);
const passerrors = ref([]);
const emailerrors = ref([]);
const duplicationerrors = ref([]);
const emailFormaterrs = ref([]);
const users = ref([]);
const router = useRouter();

const register = async () => {
  const res = await fetch("http://localhost:8008/register");
  const info = await res.json();
  users.value = info;
  const emailDuplication = users.value.filter((user) => {
    return user.email === email.value;
  });
  let pattern =
    /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;

  if (
    email.value &&
    password.value &&
    password.value.length >= 8 &&
    emailDuplication.length === 0 &&
    pattern.test(email.value)
  ) {
    console.log("1");
    const response = await fetch("http://localhost:8008/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      }),
    }).catch((err) => {
      console.log(err, "エラー");
    });
    const data = response.json();
    kakeiboDatas.value = data;
    router.push({ name: "TopView", force: true });
  } else {
    const passerr = "8文字以上入力してください";
    const emptypass = "パスワードを入力してください";
    const emptyemail = "メールアドレスを入力してください";
    const duplicationerr = "メールアドレスが存在します。";
    const emailFormaterr = "メールアドレスの形式で入力してください";

    emailerrors.value = [];
    errors.value = [];
    passerrors.value = [];
    duplicationerrors.value = [];
    emailFormaterrs.value = [];

    if (emailDuplication.length >= 1 && !duplicationerrors.value.length) {
      duplicationerrors.value.push(duplicationerr);
    }
    if (!pattern.test(email.value)) {
      emailFormaterrs.value.push(emailFormaterr);
    }
    if (!email.value && !emailerrors.value.length) {
      emailerrors.value.push(emptyemail);
    }

    if (password.value.length < 8 && !errors.value.length) {
      errors.value.push(passerr);
      console.log("a");
    }
    if (!password.value && !passerrors.value.length) {
      passerrors.value.push(emptypass);
      console.log(password.value.length);
    }
  }
};
</script>
