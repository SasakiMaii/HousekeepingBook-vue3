<script setup>
// import Modalkakeibo from "../components/ModalKakeibo.vue";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
console.log(route.query.id, "パラメーター");
// const price=kakeiboDatas.value.price.toLocalString()
const kakeiboDatas = ref([]);
// const income = ref();
// const spending = ref();
// const balance = ref();
// const yearAndMonth = ref([]);
// const days = ref([]);
// const day = ref("initial");
const kakeibo = [];
const item = ref("");
const price = ref(kakeibo.income || kakeibo.spending);
const comment = ref("");
const date = ref("");
const items = [
  "食費",
  "光熱費",
  "交通費",
  "家賃",
  "通信費",
  "保険",
  "美容費",
  "交際費",
  "給与",
  "その他",
];

//値段の３桁コンマを外す
// const removeComma = (num) => {
//   let removed = num.replace(/,/g, "");
//   console.log(removed, "remove");
//   return parseInt(removed, 10);
// };

//家計簿情報
const getKakeibo = async () => {
  const response = await fetch(`http://localhost:8008/${route.query.id}`);
  const data = await response.json();
  kakeiboDatas.value = data;
  console.log(kakeiboDatas.value);

  let ndate = new Date(kakeiboDatas.value.cretedAt);
  const yy = ndate.getFullYear();
  const mm = ("0" + (ndate.getMonth() + 1)).slice(-2);
  const dd = ("0" + ndate.getDate()).slice(-2);
  const registerDate = `${yy}-${mm}-${dd}`;

  kakeiboDatas.value.cretedAt = registerDate;

  kakeibo.push(kakeiboDatas.value);

  if (kakeibo[0].income === 0) {
    price.value = kakeibo[0].spending;
  } else {
    price.value = kakeibo[0].income;
  }
  item.value = kakeibo[0].item;
  date.value = kakeibo[0].cretedAt;
  comment.value = kakeibo[0].comment;
};

getKakeibo();

const kakeiboDelete = async () => {
  const response = await fetch(`http://localhost:8008/${route.query.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.log(err, "エラー");
  });
  const data = await response.json();
  console.log(data);
  router.push({ path: "/", force: true });
  kakeiboDatas.value.push(data);
};



const returnBtn = () => {
  router.push({ path: "/", force: true });
};
</script>

<template>
  <main>
    <header class="bg-orange-100 p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="mr-6 text-3xl p-2">家計簿</h1>
      </div>
    </header>

    <!-- <div class=" w-1/2 p-8 bg-white"> -->
    <div class="text-center">
      <!-- <h1 class="text-lg border-b-2">登録内容変更</h1> -->
      <div class="my-8">
        <label for="price">登録日</label>
        <br />
        <input
          type="date"
          id="price"
          class="border-2 mt-2"
          v-model="date"
          @blur="kanmaChange"
          pattern="\d*"
        />
      </div>

      <div class="my-5">
        <label for="itemarea">項目</label>
        <br />
        <select
          class="border-2 mt-2"
          name="itemarea"
          id="itemarea"
          v-model="item"
        >
          <option :value="item" v-for="item in items" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
      <!-- <div class="my-3">
        <label for="income">収入</label>
        <input
          class="mr-4"
          type="radio"
          id="income"
          v-model="radio"
          value="収入"
        />
        <label for="spending">支出</label>
        <input type="radio" id="spending" v-model="radio" value="支出" />
      </div> -->
      <div class="my-5">
        <label for="price">金額</label>
        <br />
        <input
          type="text"
          id="price"
          class="border-2 mt-2"
          v-model="price"
          @blur="kanmaChange"
          pattern="\d*"
        />円
      </div>

      <div class="my-5">
        <label for="comment">メモ</label>
        <br />
        <textarea
          class="border-2 mt-2"
          name="comment"
          id="comment"
          cols="20"
          rows="3"
          v-model="comment"
        ></textarea>
      </div>

      <button
        class="bg-gray-400 hover:bg-gray-300 text-white rounded px-4 py-2"
        @click="submit"
      >
        更新
      </button>
      <button
        class="bg-gray-400 hover:bg-gray-300 text-white rounded px-4 py-2 ml-4"
        @click="kakeiboDelete"
      >
        削除
      </button>
      <button
        class="bg-gray-400 hover:bg-gray-300 text-white rounded px-4 py-2 ml-4"
        @click="returnBtn"
      >
        戻る
      </button>
    </div>
  </main>
</template>
