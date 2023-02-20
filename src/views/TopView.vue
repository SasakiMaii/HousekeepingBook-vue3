<script setup>
import Modalkakeibo from "../components/ModalKakeibo.vue";
import Logout from "../components/LogoutViwe.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const localStrages = localStorage.length === 0;
const kakeiboDatas = ref([]);
const income = ref();
const spending = ref();
const balance = ref();
const yearAndMonth = ref([]);
const days = ref([]);
const day = ref("initial");

//家計簿情報
const getKakeibo = async () => {
  const response = await fetch("http://localhost:8008/kakeibo");
  const data = await response.json();
  kakeiboDatas.value = data;
  kakeiboDatas.value.map((date) => {
    let ndate = new Date(date.cretedAt);
    let registerDate =
      ndate.getFullYear() +
      "年" +
      (ndate.getMonth() + 1) +
      "月" +
      ndate.getDate() +
      "日";
    date.cretedAt = registerDate;

    //DBに登録されている年月の表示
    let monthDate = ndate.getFullYear() + "年" + (ndate.getMonth() + 1) + "月";
    yearAndMonth.value.push(monthDate);
  });

  //DBに登録されている年月の表示をリアクティブに
  const set = new Set(yearAndMonth.value);
  days.value = [...set];

  //収入
  income.value = kakeiboDatas.value.reduce((sum, el) => {
    return sum + el.income;
  }, 0);
  //支出
  spending.value = kakeiboDatas.value.reduce((sum, el) => {
    return sum + el.spending;
  }, 0);

  //収支差
  balance.value = income.value - spending.value;
};
getKakeibo();

//selectした(選択した年月)情報表示
const dateSelect = async () => {
  // 同じこと書いてるので関数にまとめたい
  const response = await fetch("http://localhost:8008/kakeibo");
  const data = await response.json();
  kakeiboDatas.value = data;
  kakeiboDatas.value.map((date) => {
    let ndate = new Date(date.cretedAt);
    let registerDate =
      ndate.getFullYear() +
      "年" +
      (ndate.getMonth() + 1) +
      "月" +
      ndate.getDate() +
      "日";
    date.cretedAt = registerDate;
    let monthDate = ndate.getFullYear() + "年" + (ndate.getMonth() + 1) + "月";
    yearAndMonth.value.push(monthDate);
  });
  const set = new Set(yearAndMonth.value);
  days.value = [...set];
  const filter = kakeiboDatas.value.filter((data) => {
    return data.cretedAt.includes(day.value);
  });
  kakeiboDatas.value = filter;

  income.value = kakeiboDatas.value.reduce((sum, el) => {
    return sum + el.income;
  }, 0);
  //支出
  spending.value = kakeiboDatas.value.reduce((sum, el) => {
    return sum + el.spending;
  }, 0);

  if (spending.value >= 200000) {
    alert("合計使用金額が20万円を超えています");
  }

  //収支差
  balance.value = income.value - spending.value;
};

const selectClear = () => {
  const router = useRouter();
  router.go({ path: "/", force: true });
};

const kakeiboDelete = async (kakeiboId) => {
  const response = await fetch(`http://localhost:8008/${kakeiboId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.log(err, "エラー");
  });
  const data = await response.json();
  // console.log(data)
  kakeiboDatas.value.push(data);
  router.go({ path: "/", force: true });
};
</script>

<template>
  <main>
    <header class="bg-orange-100 p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="mr-6 text-3xl p-2">家計簿</h1>
        <div>
          <Modalkakeibo />
          <span v-if="localStrages">
            <router-link
              to="/login"
              class="shadow-lg bg-orange-300 shadow-orange-400/50 text-black rounded px-2 py-1 ml-8"
              >ログイン</router-link
            >
          </span>
          <Logout />
        </div>
      </div>
    </header>
    <div class="flex justify-between items-center p-6">
      <div>
        <table class="table-auto text-center">
          <tr>
            <td class="border-b px-4 py-2 bg-slate-100">収入</td>
            <td class="border-b px-4 py-2">{{ income.toLocaleString() }}</td>
          </tr>
          <tr>
            <td class="border-b px-4 py-2 bg-slate-100">支出</td>
            <td class="border-b px-4 py-2">{{ spending.toLocaleString() }}</td>
          </tr>
          <tr>
            <td class="border-b px-4 py-2 bg-slate-100">収支差</td>
            <td class="border-b px-4 py-2">{{ balance.toLocaleString() }}</td>
          </tr>
        </table>
      </div>
      <div>
        <select
          name="month"
          id="month"
          class="text-xl border-b-2"
          v-model="day"
          :value="day"
          @change="dateSelect"
        >
          <option disabled value="initial">表示したい年月を選択</option>
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>
        <button
          class="shadow-lg bg-stone-300 shadow-stone-200/50 text-black rounded px-2 py-1 ml-5"
          @click="selectClear"
        >
          クリア
        </button>
      </div>
    </div>
    <table class="table-auto m-auto text-center w-full">
      <thead>
        <tr>
          <th class="px-4 py-2">日付</th>
          <th class="px-4 py-2">項目</th>
          <th class="px-4 py-2">収入</th>
          <th class="px-4 py-2">支出</th>
          <th class="px-4 py-2">メモ</th>
          <th class="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="kakeiboData in kakeiboDatas" :key="kakeiboData.id">
          <td class="border px-4 py-2">{{ kakeiboData.cretedAt }}</td>
          <td class="border px-4 py-2">{{ kakeiboData.item }}</td>
          <td class="border px-4 py-2 text-blue-700">
            {{ kakeiboData.income.toLocaleString() }}
          </td>
          <td class="border px-4 py-2 text-orange-700">
            {{ kakeiboData.spending.toLocaleString() }}
          </td>
          <td class="border px-4 py-2">{{ kakeiboData.comment }}</td>
          <td>
            <button
              class="shadow-lg bg-stone-200 shadow-stone-300/50 text-black rounded px-2 py-1"
            >
              <router-link
                :to="{
                  path: '/update',
                  params: { id: kakeiboData.id },
                  query: { id: kakeiboData.id },
                }"
                >変更</router-link
              >
            </button>
          </td>
          <td>
            <button
              @click="kakeiboDelete(kakeiboData.id)"
              class="shadow-lg bg-stone-200 shadow-stone-300/50 text-black rounded px-2 py-1"
            >
              削除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
