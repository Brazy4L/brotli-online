<script setup>
import { ref } from "vue";
import { compress } from "brotli-compress";

useHead({
  title: "Brotli Online",
  meta: [{ name: "color-scheme", content: "dark" }],
  link: [{ rel: "icon", href: "/brotli-online/favicon.svg", type: "image/svg+xml" }],
});

const inputText = ref("");
const originalSize = ref("");
const brotliSize = ref("");
const compressionRate = ref("");
const compressionPercentage = ref("");
const removeWhitespace = ref(false);
const brotliQuality = ref(11);
const compressionTime = ref("");

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
  const brotliQualityNumber = parseFloat(brotliQuality.value);
  const inputTextNoWhitespace = inputText.value.replace(/\s/g, "");

  const textEncoder = new TextEncoder();
  const encodedInputText = textEncoder.encode(removeWhitespace.value ? inputTextNoWhitespace : inputText.value);

  const startTime = performance.now();
  const compressedInputText = await compress(encodedInputText, { quality: brotliQualityNumber });
  const endTime = performance.now();

  const compressedInputTextSize = compressedInputText.length;
  const inputTextSize = byteLengthUtf8(removeWhitespace.value ? inputTextNoWhitespace : inputText.value);
  originalSize.value = convertBytes(inputTextSize);
  brotliSize.value = convertBytes(compressedInputTextSize);
  compressionRate.value = parseFloat((inputTextSize / compressedInputTextSize).toFixed(3));
  compressionPercentage.value = Math.abs(
    parseFloat(((inputTextSize / compressedInputTextSize) * 100 - 100).toFixed(0))
  );
  compressionTime.value = parseFloat(((endTime - startTime) / 1000).toFixed(3)) + " sec";
}
</script>

<template>
  <textarea v-model="inputText" placeholder="/* Your Code Here */"></textarea>
  <div class="info">
    <button @click="getCompressedSizeInputText">Compress</button>
    <div class="heading">
      <div class="heading-line"></div>
      <div class="heading-heading">Options</div>
      <div class="heading-line"></div>
    </div>
    <div class="checkbox">
      <input
        type="checkbox"
        id="checkbox"
        v-model="removeWhitespace"
        @keydown.enter="removeWhitespace = !removeWhitespace"
      />
      <label class="checkbox-text" for="checkbox">Remove whitespace</label>
    </div>
    <div class="heading">
      <div class="heading-line"></div>
      <div class="heading-heading">Brotli</div>
      <div class="heading-line"></div>
    </div>
    <div class="quality">
      <span class="subtext">Quality:</span><span class="quality-span">{{ brotliQuality }}</span>
    </div>
    <input type="range" min="0" max="11" class="slider" v-model="brotliQuality" />
    <div class="line">
      <span class="subtext">Original size:</span>{{ " " }}
      <span class="text" v-if="originalSize">{{ originalSize }}</span>
    </div>
    <div class="line">
      <span class="subtext">Brotli size:</span>{{ " " }} <span class="text" v-if="brotliSize">{{ brotliSize }}</span
      >{{ " " }}
      <span class="compression compression-green" v-if="compressionRate > 1">
        {{ compressionPercentage }}% smaller than original</span
      >
      <span class="compression compression-red" v-if="Number.isFinite(compressionRate) && compressionRate < 1">
        {{ compressionPercentage }}% larger than original</span
      >
    </div>
    <div class="line">
      <span class="subtext">Compression rate:</span>{{ " " }}
      <span class="text" v-if="compressionRate">{{ compressionRate }}</span>
    </div>
    <div class="line">
      <span class="subtext">Compression time:</span>{{ " " }}
      <span class="text" v-if="compressionTime">{{ compressionTime }}</span>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

:root {
  background-color: #161616;
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
  gap: 16px;
}

textarea {
  font-size: 1rem;
  width: 100%;
  height: 300px;
  border-radius: 4px;
  padding: 16px;
  margin: 0;
  background-color: #292929;
  border: 4px solid #fff;
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

button:focus-visible {
  outline: solid 4px #fff;
}

.heading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.heading-line {
  height: 1px;
  width: 100%;
  background-color: #b4b4b4;
}

.heading-heading {
  min-width: fit-content;
}

.checkbox {
  display: flex;
}

#checkbox {
  margin: 0;
  width: 16px;
  height: 16px;
  accent-color: #43ff82;
}

.checkbox-text {
  padding-left: 4px;
}

.quality {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.quality-span {
  min-width: 17.8px;
}

.slider {
  appearance: none;
  width: 100%;
  height: 12px;
  border-radius: 4px;
  background-color: #161616;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: #43ff82;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  border: 0;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: #43ff82;
  cursor: pointer;
}

.slider:focus-visible {
  outline: solid 2px #fff;
}

.line {
  min-height: 26px;
  display: flex;
  align-items: center;
  column-gap: 4px;
  row-gap: 8px;
  flex-wrap: wrap;
}

.subtext {
  color: #b4b4b4;
}

.text {
  background-color: #fff;
  padding: 4px 16px;
  border-radius: 9999px;
  color: #000;
  white-space: nowrap;
}

.compression {
  padding: 4px 16px;
  border-radius: 9999px;
  white-space: nowrap;
  color: #000;
}

.compression-green {
  background-color: #43ff82;
}

.compression-red {
  background-color: #ff5943;
}
</style>
