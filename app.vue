<script setup>
import { ref } from "vue";
import { compress } from "brotli-compress";

useHead({
  title: "Brotli Online",
  meta: [{ name: "color-scheme", content: "dark" }],
});

const inputText = ref("");
const originalSize = ref("");
const brotliSize = ref("");
const compressionRate = ref("");
const compressionPercentage = ref("");

const byteLengthUtf8 = (str) => new Blob([str]).size;

async function getCompressedSizeInputText() {
  const textEncoder = new TextEncoder();
  const encodedInputText = textEncoder.encode(inputText.value);
  const compressedInputText = await compress(encodedInputText);

  const sizeInBytes = compressedInputText.length;
  const sizeInKB = compressedInputText.length / 1_000;
  const sizeInMB = compressedInputText.length / 1_000_000;

  const inputTextSize = byteLengthUtf8(inputText.value);
  originalSize.value = inputTextSize;
  brotliSize.value = sizeInBytes;
  compressionRate.value = inputTextSize / sizeInBytes;
  compressionPercentage.value = (inputTextSize / sizeInBytes) * 100 - 100;
}
</script>

<template>
  <textarea v-model="inputText" placeholder="/* Your Code Here */"></textarea>
  <div class="info">
    <button @click="getCompressedSizeInputText">Compress</button>
    <div>
      <span class="subtext">Original size:</span>
      <span>{{ originalSize }}</span>
    </div>
    <div>
      <span class="subtext">Brotli size:</span> <span>{{ brotliSize }}</span>
    </div>
    <div>
      <span class="subtext">Compression rate:</span>
      <span>{{ compressionRate }}</span>
    </div>
    <div>
      <span class="subtext">Compression Percentage:</span>
      <span>{{ compressionPercentage }}</span>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

:root {
  background: #161616;
  font-family: sans-serif;
}

body {
  margin: 0;
}

#__nuxt {
  max-width: 800px;
  margin: 16px auto 16px auto;
  padding: 0 16px;
}

textarea {
  width: 100%;
  height: 300px;
  border-radius: 4px;
  padding: 16px;
  background-color: #292929;
  border: 4px solid #dadada;
  outline: none;
  resize: none;
  transition: border 0.15s ease-out;
}

textarea:focus {
  border: 4px solid #43ff82;
}

textarea::placeholder {
  color: #dadada;
}

.info {
  background-color: #292929;
  padding: 16px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

button {
  padding: 16px;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  background-color: #43ff82;
  color: #000;
  transition: background-color 0.15s ease-out;
}

button:hover {
  background-color: #37d46b;
}

.subtext {
  color: #dadada;
}
</style>
