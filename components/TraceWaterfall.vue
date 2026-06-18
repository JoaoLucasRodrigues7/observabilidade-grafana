<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

// frozen=true: a animação para e o trace fica inteiro no estado final.
// frozen=false: a animação roda em loop (estado inicial, ao entrar no slide).
const props = defineProps<{ frozen?: boolean }>()

// Um trace distribuído: cada span tem início (offset) e duração em ms,
// e um nível de profundidade (depth) que indica a relação pai/filho.
interface Span {
  name: string
  service: string
  start: number
  dur: number
  depth: number
  color: string
}

const TOTAL = 320 // duração total do trace em ms

const spans: Span[] = [
  { name: 'GET /checkout', service: 'gateway', start: 0, dur: 320, depth: 0, color: '#f46800' },
  { name: 'auth.verify', service: 'auth', start: 12, dur: 48, depth: 1, color: '#7b61ff' },
  { name: 'cart.load', service: 'cart', start: 64, dur: 70, depth: 1, color: '#00b3a4' },
  { name: 'SELECT cart_items', service: 'postgres', start: 78, dur: 44, depth: 2, color: '#3b82f6' },
  { name: 'payment.charge', service: 'payment', start: 140, dur: 150, depth: 1, color: '#e0b400' },
  { name: 'POST stripe.api', service: 'external', start: 152, dur: 120, depth: 2, color: '#ec4899' },
  { name: 'order.persist', service: 'order', start: 294, dur: 24, depth: 1, color: '#22c55e' },
]

const elapsed = ref(0)
let raf = 0
let startTs = 0

function loop(ts: number) {
  if (!startTs)
    startTs = ts
  // 1.6s para "preencher" o trace, depois pausa e reinicia
  const t = ((ts - startTs) % 2600) / 1600
  elapsed.value = Math.min(1, t) * TOTAL
  raf = requestAnimationFrame(loop)
}

function startLoop() {
  cancelAnimationFrame(raf)
  startTs = 0
  raf = requestAnimationFrame(loop)
}
function freeze() {
  cancelAnimationFrame(raf)
  elapsed.value = TOTAL // trace inteiro visível
}

watch(() => props.frozen, (f) => {
  if (f)
    freeze()
  else
    startLoop()
})

onMounted(() => {
  if (props.frozen)
    freeze()
  else
    startLoop()
})
onUnmounted(() => cancelAnimationFrame(raf))

function widthPct(s: Span) {
  const visible = Math.max(0, Math.min(s.dur, elapsed.value - s.start))
  return (visible / TOTAL) * 100
}
function leftPct(s: Span) {
  return (s.start / TOTAL) * 100
}
const cursorPct = computed(() => (elapsed.value / TOTAL) * 100)
</script>

<template>
  <div class="rounded-lg border border-gray-500/30 bg-black/20 p-3 font-mono text-xs">
    <div class="relative">
      <div v-for="(s, i) in spans" :key="i" class="mb-1.5 flex items-center gap-2">
        <div class="w-32 truncate text-right opacity-80" :style="{ paddingLeft: `${s.depth * 8}px` }">
          {{ s.name }}
        </div>
        <div class="relative h-4 flex-1 rounded bg-white/5">
          <div class="absolute top-0 h-full rounded transition-none"
            :style="{ left: `${leftPct(s)}%`, width: `${widthPct(s)}%`, background: s.color }" />
          <span v-if="widthPct(s) > 0" class="absolute top-0 h-full flex items-center pl-1 text-[9px] opacity-70"
            :style="{ left: `${leftPct(s)}%` }">
            {{ s.dur }}ms
          </span>
        </div>
      </div>
      <!-- cursor de tempo -->
      <div class="pointer-events-none absolute top-0 bottom-0 w-px bg-orange-400/60"
        :style="{ left: `calc(8.5rem + ${cursorPct}% * 0.999)` }" />
    </div>
    <div class="mt-1 flex justify-between text-[9px] opacity-50">
      <span>0ms</span><span>{{ Math.round(elapsed) }}ms</span><span>{{ TOTAL }}ms</span>
    </div>
  </div>
</template>
