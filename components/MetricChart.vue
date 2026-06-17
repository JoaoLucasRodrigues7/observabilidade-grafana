<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  // cor da linha
  color: { default: '#f46800' },
  // rótulo da métrica
  label: { default: 'http_requests_total (rate 1m)' },
  // unidade exibida
  unit: { default: 'req/s' },
  // volatilidade da série
  volatility: { default: 0.18 },
})

const WIDTH = 520
const HEIGHT = 200
const POINTS = 60

const values = ref<number[]>(Array.from({ length: POINTS }, () => 0.5))
const current = ref(0)
let raf = 0
let last = 0
let phase = 0

function step(now: number) {
  if (now - last > 90) {
    last = now
    phase += 0.18
    // sinal base + ruído + picos ocasionais
    const base = 0.5 + 0.28 * Math.sin(phase) + 0.1 * Math.sin(phase * 2.7)
    const noise = (Math.random() - 0.5) * props.volatility
    const spike = Math.random() > 0.94 ? Math.random() * 0.35 : 0
    let v = base + noise + spike
    v = Math.max(0.05, Math.min(0.98, v))
    values.value = [...values.value.slice(1), v]
    current.value = Math.round(v * 1240)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => { raf = requestAnimationFrame(step) })
onUnmounted(() => cancelAnimationFrame(raf))

function path(vals: number[]) {
  const dx = WIDTH / (vals.length - 1)
  return vals
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i * dx).toFixed(1)} ${(HEIGHT - v * HEIGHT).toFixed(1)}`)
    .join(' ')
}
function area(vals: number[]) {
  return `${path(vals)} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`
}
</script>

<template>
  <div class="rounded-lg border border-gray-500/30 bg-black/20 p-3 backdrop-blur">
    <div class="mb-1 flex items-center justify-between">
      <span class="font-mono text-xs opacity-70">{{ label }}</span>
      <span class="font-mono text-lg font-bold" :style="{ color }">
        {{ current }} <span class="text-xs opacity-60">{{ unit }}</span>
      </span>
    </div>
    <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" class="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient :id="`grad-${label}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="0.35" />
          <stop offset="100%" :stop-color="color" stop-opacity="0" />
        </linearGradient>
      </defs>
      <line v-for="i in 4" :key="i" x1="0" :x2="WIDTH" :y1="(HEIGHT / 4) * i" :y2="(HEIGHT / 4) * i"
        stroke="currentColor" stroke-opacity="0.08" stroke-width="1" />
      <path :d="area(values)" :fill="`url(#grad-${label})`" />
      <path :d="path(values)" fill="none" :stroke="color" stroke-width="2.5"
        stroke-linejoin="round" stroke-linecap="round" />
      <circle :cx="WIDTH" :cy="HEIGHT - values[values.length - 1] * HEIGHT" r="4" :fill="color">
        <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
</template>
