<script setup lang="ts">
// Ilustração estática de cada tipo de métrica do Prometheus.
defineProps<{ type: 'counter' | 'gauge' | 'histogram' | 'summary' }>()

// Barras de um histograma (formato de distribuição / sino).
const buckets = [14, 28, 46, 58, 40, 22, 12]
</script>

<template>
  <svg viewBox="0 0 200 80" class="w-full">
    <!-- linhas de grade -->
    <line v-for="i in 3" :key="i" x1="0" :x2="200" :y1="i * 20" :y2="i * 20"
      stroke="currentColor" stroke-opacity="0.08" />

    <!-- COUNTER: só sobe, e zera ao reiniciar -->
    <template v-if="type === 'counter'">
      <polyline points="6,72 36,72 36,58 70,58 70,44 104,44 104,30 138,30 138,16 168,16"
        fill="none" stroke="#f46800" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
      <line x1="168" y1="16" x2="168" y2="72" stroke="#f46800" stroke-width="2" stroke-dasharray="3 3" stroke-opacity="0.5" />
      <polyline points="168,72 194,72 194,66" fill="none" stroke="#f46800" stroke-width="3" stroke-linecap="round" />
    </template>

    <!-- GAUGE: sobe e desce livremente -->
    <template v-else-if="type === 'gauge'">
      <polyline points="6,46 30,20 54,54 78,30 102,58 126,22 150,48 174,28 194,40"
        fill="none" stroke="#00b3a4" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
    </template>

    <!-- HISTOGRAM: distribuição em buckets -->
    <template v-else-if="type === 'histogram'">
      <rect v-for="(h, i) in buckets" :key="i" :x="8 + i * 27" :y="76 - h" width="20" :height="h"
        rx="2" fill="#7b61ff" fill-opacity="0.85" />
    </template>

    <!-- SUMMARY: distribuição + quantis calculados no cliente -->
    <template v-else>
      <rect v-for="(h, i) in buckets" :key="i" :x="8 + i * 27" :y="76 - h" width="20" :height="h"
        rx="2" fill="#3b82f6" fill-opacity="0.45" />
      <g v-for="(q, i) in [{ x: 70, l: 'p50' }, { x: 122, l: 'p90' }, { x: 160, l: 'p99' }]" :key="i">
        <line :x1="q.x" y1="6" :x2="q.x" y2="76" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3 2" />
        <text :x="q.x + 2" y="14" fill="#93c5fd" font-size="9" font-family="monospace">{{ q.l }}</text>
      </g>
    </template>
  </svg>
</template>
