<template>
  <button
    class="bg-blue-400 hover:bg-gray-300 text-white rounded px-4 py-2"
    v-show="modalBtn"
    @click="modalClick"
  >
    家計簿に登録する
  </button>

  <div
    v-show="modalShow"
    class="p-5 text-center z-10 fixed top-0 left-0 w-full h-full bg-slate-700 bg-opacity-50 flex items-center justify-center"
  >
    <div class="z-2 w-1/2 p-8 bg-white">
      <h1 class="text-lg border-b-2">家計簿登録</h1>
      <div class="my-3">
        <label for="itemarea">項目</label>
        <br />
        <select class="border-2" name="itemarea" id="itemarea" v-model="item">
          <option :value="item" v-for="item in items" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="my-3">
        <label for="income">収入</label>
        <input type="radio" id="income" v-model="radio" value="収入" />
        <label for="spending">支出</label>
        <input type="radio" id="spending" v-model="radio" value="支出" />
      </div>
      <div class="my-3">
        <label for="price">金額</label>
        <br />
        <input
          type="text"
          id="price"
          class="border-2"
          v-model="price"
          @blur="kanmaChange"
          pattern="\d*"
        />円
      </div>

      <div class="my-3">
        <label for="comment">メモ</label>
        <br />
        <textarea
          class="border-2"
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
        登録
      </button>
      <button
        class="bg-gray-400 hover:bg-gray-300 text-white rounded px-4 py-2 ml-4"
        @click="returnBtn"
      >
        戻る
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute,useRouter } from "vue-router";
const router = useRouter()
const route = useRoute()

const kakeiboDatas = ref([]);
const kakeibo = ref("");
const radio = ref("");
const item = ref("食費");
const modalShow = ref(false);
const modalBtn = ref(true);
const price = ref("");
const income = ref("");
const spending = ref("");
const comment = ref("");
const cretedAt = ref("");
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
// console.log(items.value)

//３桁カンマ、半角数字以外は削除
const kanmaChange = () => {
  let inputAnsValue = price.value;
  let numberAns = inputAnsValue.replace(/[^0-9]/g, "");
  console.log(numberAns, "aaa");
  let kanmaAns = numberAns.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  console.log(kanmaAns, "aas");
  if (kanmaAns.match(/[^0-9]/g)) {
    price.value = kanmaAns;
    return true;
  }
};

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
  });
};
getKakeibo();

const modalClick = () => {
  modalShow.value = true;
  modalBtn.value = false;
};

const now = new Date();

const removeComma = (num) => {
  let removed = num.replace(/,/g, "");
  console.log(removed, "remove");
  return parseInt(removed, 10);
};

const submit = async () => {
  modalShow.value = false;
  modalBtn.value = true;

  if (radio.value === "収入") {
    income.value = price.value;
    income.value = removeComma(income.value);
    console.log(typeof income.value);
  } else if (radio.value === "支出") {
    spending.value = price.value;
    spending.value = removeComma(spending.value);
  }

  // console.log(item.value,'項目');
  // console.log(Number(income.value),'収入');
  // console.log(Number(spending.value),'支出');
  // console.log(comment.value,'コメント');
  // console.log(now,'時刻');

  const response = await fetch("http://localhost:8008/kakeibo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item: item.value,
      income: Number(income.value) || 0,
      spending: Number(spending.value) || 0,
      comment: comment.value || "",
      cretedAt: now,
    }),
  }).catch((err) => {
    console.log(err, "エラー");
  });
  const data = await response.json();
  kakeiboDatas.value.push(data);
  router.go({path: '/', force: true})
  kakeibo.value = "";
};

const returnBtn = () => {
  modalShow.value = false;
  modalBtn.value = true;
};
</script>

<style></style>
