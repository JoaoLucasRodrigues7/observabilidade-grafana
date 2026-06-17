<script setup lang="ts">
// Diagrama animado: aplicação -> coletor -> backends -> Grafana.
// Pacotes de dados fluem pelas conexões continuamente.
const flows = [
  { id: 'metrics', y: 70, label: 'métricas', color: '#f46800', backend: 'Prometheus' },
  { id: 'logs', y: 140, label: 'logs', color: '#00b3a4', backend: 'Loki' },
  { id: 'traces', y: 210, label: 'traces', color: '#7b61ff', backend: 'Tempo' },
]
</script>

<template>
  <svg viewBox="0 0 700 280" class="w-full">
    <!-- nós -->
    <g font-family="monospace">
      <!-- App -->
      <rect x="10" y="110" width="110" height="60" rx="8" fill="#1f2937" stroke="#4b5563" />
      <text x="65" y="138" fill="#e5e7eb" font-size="13" text-anchor="middle">aplicação</text>
      <text x="65" y="156" fill="#9ca3af" font-size="10" text-anchor="middle">+ SDK / OTel</text>

      <!-- Collector -->
      <rect x="230" y="105" width="120" height="70" rx="8" fill="#111827" stroke="#6b7280" />
      <text x="290" y="135" fill="#e5e7eb" font-size="12" text-anchor="middle">OTel</text>
      <text x="290" y="152" fill="#e5e7eb" font-size="12" text-anchor="middle">Collector</text>

      <!-- backends -->
      <g v-for="f in flows" :key="f.id">
        <rect x="450" :y="f.y - 22" width="120" height="44" rx="8" fill="#1f2937" :stroke="f.color" />
        <text x="510" :y="f.y + 2" :fill="f.color" font-size="12" text-anchor="middle" font-weight="bold">
          {{ f.backend }}
        </text>
        <text x="510" :y="f.y + 16" fill="#9ca3af" font-size="9" text-anchor="middle">{{ f.label }}</text>
      </g>

      <!-- Grafana -->
      <rect x="620" y="105" width="70" height="70" rx="8" fill="#f46800" />
      <text x="655" y="138" fill="#fff" font-size="11" text-anchor="middle" font-weight="bold">Grafana</text>
      <text x="655" y="154" fill="#fff" font-size="9" text-anchor="middle">UI</text>
    </g>

    <!-- conexões app -> collector -->
    <path id="ac" d="M120 140 L230 140" stroke="#4b5563" stroke-width="2" fill="none" />

    <!-- collector -> backends e backends -> grafana -->
    <g v-for="f in flows" :key="f.id">
      <path :d="`M350 140 C 400 140, 410 ${f.y}, 450 ${f.y}`" :stroke="f.color" stroke-width="2"
        fill="none" stroke-opacity="0.4" />
      <path :d="`M570 ${f.y} C 600 ${f.y}, 610 140, 620 140`" :stroke="f.color" stroke-width="2"
        fill="none" stroke-opacity="0.4" />

      <!-- pacotes animados -->
      <circle r="4" :fill="f.color">
        <animateMotion :dur="`${1.6}s`" repeatCount="indefinite"
          :path="`M350 140 C 400 140, 410 ${f.y}, 450 ${f.y}`" />
      </circle>
      <circle r="4" :fill="f.color">
        <animateMotion :dur="`${1.4}s`" repeatCount="indefinite" begin="0.5s"
          :path="`M570 ${f.y} C 600 ${f.y}, 610 140, 620 140`" />
      </circle>
    </g>

    <!-- pacotes app -> collector -->
    <circle r="4" fill="#e5e7eb">
      <animateMotion dur="1.2s" repeatCount="indefinite" path="M120 140 L230 140" />
    </circle>
  </svg>
</template>
