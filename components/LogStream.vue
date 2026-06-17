<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// Stream de logs estruturados estilo Loki / aplicação.
// >>> SUBSTITUA pelos logs reais do sistema quando estiverem disponíveis. <<<
interface Line {
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  msg: string
}

const SOURCE: Line[] = [
  { level: 'INFO', msg: 'http: GET /checkout traceID=4f1c2a status=200 dur=312ms' },
  { level: 'DEBUG', msg: 'cart: loaded 3 items for user_id=8821' },
  { level: 'INFO', msg: 'payment: charge initiated amount=149.90 provider=stripe' },
  { level: 'WARN', msg: 'payment: stripe latency high dur=120ms p99_breach=true' },
  { level: 'INFO', msg: 'order: persisted order_id=ORD-5567 traceID=4f1c2a' },
  { level: 'ERROR', msg: 'auth: token expired user_id=4410 traceID=9b7e1d' },
  { level: 'INFO', msg: 'http: GET /health status=200 dur=2ms' },
  { level: 'DEBUG', msg: 'cache: hit key=catalog:home ttl=58s' },
]

const colors: Record<Line['level'], string> = {
  INFO: 'text-sky-400',
  WARN: 'text-amber-400',
  ERROR: 'text-red-400',
  DEBUG: 'text-gray-400',
}

const lines = ref<Array<Line & { ts: string }>>([])
let timer: ReturnType<typeof setInterval>
let idx = 0
let clock = 0

function ts() {
  clock += Math.floor(Math.random() * 3) + 1
  const d = new Date(2026, 5, 17, 9, 14, clock % 60)
  return d.toTimeString().slice(0, 8)
}

onMounted(() => {
  timer = setInterval(() => {
    const src = SOURCE[idx % SOURCE.length]
    lines.value.push({ ...src, ts: ts() })
    if (lines.value.length > 9)
      lines.value.shift()
    idx++
  }, 900)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-gray-500/30 bg-[#0d1117] shadow-lg">
    <div class="flex items-center gap-1.5 border-b border-gray-500/20 px-3 py-2">
      <div class="h-2.5 w-2.5 rounded-full bg-red-500/70" />
      <div class="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
      <div class="h-2.5 w-2.5 rounded-full bg-green-500/70" />
      <span class="ml-2 font-mono text-xs opacity-50">{job="checkout-api"} | logfmt</span>
    </div>
    <div class="h-64 p-3 font-mono text-xs leading-relaxed">
      <TransitionGroup name="logline">
        <div v-for="l in lines" :key="l.ts + l.msg" class="flex gap-2 whitespace-nowrap">
          <span class="opacity-40">{{ l.ts }}</span>
          <span :class="colors[l.level]" class="w-12 shrink-0 font-bold">{{ l.level }}</span>
          <span class="opacity-90">{{ l.msg }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.logline-enter-active {
  transition: all 0.4s ease;
}
.logline-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.logline-move {
  transition: transform 0.4s ease;
}
</style>
