<script setup>
import Modalkakeibo from "../components/ModalKakeibo.vue";
import { computed, ref } from "vue";
// const price=kakeiboDatas.value.price.toLocalString()
const kakeiboDatas = ref([]);
const income = ref();
const spending = ref();
const balance = ref();

const removeComma = (num) => {
  let removed = num.replace(/,/g, "");
  console.log(removed, "remove");
  return parseInt(removed, 10);
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

  income.value = kakeiboDatas.value.reduce((sum, el) => {
    return sum + el.income;
  }, 0);
  spending.value = kakeiboDatas.value.reduce((sum, el) => {
    return sum + el.spending;
  }, 0);

  balance.value = income.value - spending.value;
};

getKakeibo();
</script>

<template>
  <main>
    <header class="bg-sky-100 p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="mr-6 text-3xl p-2">家計簿</h1>
        <Modalkakeibo />
      </div>
    </header>
    <div class="flex justify-between items-center p-6">
      <div>
        <table class="table-auto text-center ">
          <tr >
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
        <select name="month" id="month" class="text-xl border-b-2">
          <option value="">2023年1月</option>
          <option value="">2023年2月</option>
          <option value="">2023年3月</option>
        </select>
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="kakeiboData in kakeiboDatas" :key="kakeiboData.id">
          <td class="border px-4 py-2">{{ kakeiboData.cretedAt }}</td>
          <td class="border px-4 py-2">{{ kakeiboData.item }}</td>
          <td class="border px-4 py-2">
            {{ kakeiboData.income.toLocaleString() }}
          </td>
          <td class="border px-4 py-2">
            {{ kakeiboData.spending.toLocaleString() }}
          </td>
          <td class="border px-4 py-2">{{ kakeiboData.comment }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
