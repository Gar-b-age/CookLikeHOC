<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const MIN = 0.1
const MAX = 2
const STEP = 0.05

const PRESETS = [
  { label: '¼份', value: 0.25 },
  { label: '½份', value: 0.5 },
  { label: '1份', value: 1 },
  { label: '2份', value: 2 },
]

const scale = ref(1)
const hasQuantities = ref(false)
let observer: MutationObserver | null = null

const scaleLabel = computed(() => String(Math.round(scale.value * 100) / 100))

function formatQty(qty: number, s: number): string {
  return String(Math.round(qty * s * 100) / 100)
}

function applyScale() {
  const els = document.querySelectorAll<HTMLElement>('.vp-doc .qty')
  hasQuantities.value = els.length > 0
  for (const el of els) {
    const qty = Number.parseFloat(el.dataset.qty ?? '0')
    const unit = el.dataset.unit ?? ''
    const next = formatQty(qty, scale.value) + unit
    // 幂等：仅在需要时改写，避免 MutationObserver 反复触发
    if (el.textContent !== next) el.textContent = next
  }
}

function onSlider(e: Event) {
  scale.value = Number((e.target as HTMLInputElement).value)
  applyScale()
}

function setPreset(v: number) {
  scale.value = v
  applyScale()
}

function reset() {
  scale.value = 1
  applyScale()
}

onMounted(() => {
  applyScale()
  // 客户端路由切换时 .vp-doc 内容会被替换，监听 DOM 变化并重新应用比例
  observer = new MutationObserver(() => applyScale())
  observer.observe(document.body, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div v-if="hasQuantities" class="qty-scaler">
    <div class="qty-scaler__header">
      <span class="qty-scaler__title">份量</span>
      <span class="qty-scaler__value">×{{ scaleLabel }}</span>
      <button class="qty-scaler__reset" type="button" @click="reset">重置</button>
    </div>
    <input
      class="qty-scaler__slider"
      type="range"
      :min="MIN"
      :max="MAX"
      :step="STEP"
      :value="scale"
      aria-label="调整份量比例"
      @input="onSlider"
    />
    <div class="qty-scaler__presets">
      <button
        v-for="p in PRESETS"
        :key="p.value"
        type="button"
        :class="{ 'is-active': scale === p.value }"
        @click="setPreset(p.value)"
      >
        {{ p.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.qty-scaler {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  z-index: 30;
  width: 264px;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: var(--vp-c-bg-elv, var(--vp-c-bg-soft, #fff));
  border: 1px solid var(--vp-c-divider, rgba(60, 60, 60, 0.12));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  font-size: 0.875rem;
}

.qty-scaler__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.qty-scaler__title {
  font-weight: 600;
}

.qty-scaler__value {
  font-weight: 700;
  color: var(--vp-c-brand-1, #3451b2);
}

.qty-scaler__reset {
  margin-left: auto;
  border: 1px solid var(--vp-c-divider, rgba(60, 60, 60, 0.12));
  background: transparent;
  color: var(--vp-c-text-1, inherit);
  border-radius: 6px;
  padding: 0.1rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.qty-scaler__slider {
  width: 100%;
  accent-color: var(--vp-c-brand-1, #3451b2);
}

.qty-scaler__presets {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.4rem;
}

.qty-scaler__presets button {
  flex: 1;
  border: 1px solid var(--vp-c-divider, rgba(60, 60, 60, 0.12));
  background: transparent;
  color: var(--vp-c-text-1, inherit);
  border-radius: 6px;
  padding: 0.2rem 0;
  cursor: pointer;
  font-size: 0.75rem;
}

.qty-scaler__presets button.is-active {
  border-color: var(--vp-c-brand-1, #3451b2);
  color: var(--vp-c-brand-1, #3451b2);
  font-weight: 600;
}

@media (max-width: 640px) {
  .qty-scaler {
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    border-radius: 12px 12px 0 0;
  }
}
</style>
