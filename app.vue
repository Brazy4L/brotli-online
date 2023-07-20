<script setup>
import { ref } from "vue";
import { compress } from "brotli-compress";

const inputText = ref("");

async function getCompressedSizeInputText() {
  const textEncoder = new TextEncoder();
  const encodedInputText = textEncoder.encode(inputText.value);
  const compressedInputText = await compress(encodedInputText);
  const sizeInBytes = compressedInputText.length;
  const sizeInKB = compressedInputText.length / 1_000;
  const sizeInMB = compressedInputText.length / 1_000_000;
  console.log(sizeInBytes);
  console.log(sizeInKB);
  console.log(sizeInMB);
}
</script>

<template>
  <textarea v-model="inputText" placeholder="/* Your Code Here */"></textarea>
  <button @click="getCompressedSizeInputText">Compress</button>
</template>

<style>
body {
  margin: 0;
}
</style>
