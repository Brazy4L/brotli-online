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

const convertBytes = (bytes) => {
  let units = ["B", "KB", "MB"];
  let i = 0;
  for (i; bytes > 1_000; i++) {
    bytes /= 1_000;
    if (i === 2) {
      break;
    }
  }

  return parseFloat(bytes.toFixed(3)) + " " + units[i];
};

async function getCompressedSizeInputText() {
  if (!inputText.value) {
    return;
  }

  const textEncoder = new TextEncoder();
  const encodedInputText = textEncoder.encode(inputText.value);
  const compressedInputText = await compress(encodedInputText);
  const compressedInputTextSize = compressedInputText.length;

  const inputTextSize = byteLengthUtf8(inputText.value);
  originalSize.value = convertBytes(inputTextSize);
  brotliSize.value = convertBytes(compressedInputTextSize);
  compressionRate.value = parseFloat(
    (inputTextSize / compressedInputTextSize).toFixed(3)
  );
  compressionPercentage.value = Math.abs(
    parseFloat(
      ((inputTextSize / compressedInputTextSize) * 100 - 100).toFixed(0)
    )
  );
}
</script>

<template>
  <textarea v-model="inputText" placeholder="/* Your Code Here */"></textarea>
  <div class="info">
    <button @click="getCompressedSizeInputText">Compress</button>
    <div>
      <span class="subtext">Original size:</span>{{ " " }}
      <span>{{ originalSize }}</span>
    </div>
    <div>
      <span class="subtext">Brotli size:</span>{{ " "
      }}<span>{{ brotliSize }}</span>
      <span class="compression-green" v-if="compressionRate > 1">
        ({{ compressionPercentage }}% smaller than original)</span
      >
      <span
        class="compression-red"
        v-if="Number.isFinite(compressionRate) && compressionRate < 1"
      >
        ({{ compressionPercentage }}% larger than original)</span
      >
    </div>
    <div>
      <span class="subtext">Compression rate:</span>{{ " " }}
      <span>{{ compressionRate }}</span>
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

textarea {
  font-size: 1rem;
  width: 100%;
  height: 300px;
  border-radius: 4px;
  padding: 16px;
  margin: 0;
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
  color: #b4b4b4;
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
  font-size: 1rem;
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
  color: #b4b4b4;
}
</style>
