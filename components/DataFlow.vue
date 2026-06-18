<script setup lang="ts">
// Diagrama animado: aplicação -> coletor -> backends -> Grafana.
// Pacotes de dados fluem pelas conexões continuamente.
const base = import.meta.env.BASE_URL

const flows = [
  { id: 'metrics', y: 70, label: 'métricas', color: '#f46800', backend: 'Prometheus', icon: 'prometheus' },
  { id: 'logs', y: 165, label: 'logs', color: '#00b3a4', backend: 'Loki', icon: 'loki' },
  { id: 'traces', y: 260, label: 'traces', color: '#7b61ff', backend: 'Tempo', icon: 'tempo' },
]
const MID = 165 // eixo vertical central (app / collector / grafana)
</script>

<template>
  <!-- font-size definido via CSS escopado (.svg-flow text) para vencer o tema global -->
  <svg viewBox="0 0 820 330" class="svg-flow w-full">
    <!-- ===== conexões (desenhadas antes dos nós) ===== -->
    <path :d="`M150 ${MID} L250 ${MID}`" stroke="#4b5563" stroke-width="2" fill="none" />
    <g v-for="f in flows" :key="`edge-${f.id}`">
      <path :d="`M390 ${MID} C 440 ${MID}, 450 ${f.y}, 500 ${f.y}`"
        :stroke="f.color" stroke-width="2" fill="none" stroke-opacity="0.4" />
      <path :d="`M660 ${f.y} C 700 ${f.y}, 710 ${MID}, 720 ${MID}`"
        :stroke="f.color" stroke-width="2" fill="none" stroke-opacity="0.4" />
    </g>

    <!-- ===== pacotes animados ===== -->
    <circle r="4" fill="#e5e7eb">
      <animateMotion dur="1.2s" repeatCount="indefinite" :path="`M150 ${MID} L250 ${MID}`" />
    </circle>
    <g v-for="f in flows" :key="`pkt-${f.id}`">
      <circle r="4" :fill="f.color">
        <animateMotion dur="1.6s" repeatCount="indefinite"
          :path="`M390 ${MID} C 440 ${MID}, 450 ${f.y}, 500 ${f.y}`" />
      </circle>
      <circle r="4" :fill="f.color">
        <animateMotion dur="1.4s" repeatCount="indefinite" begin="0.5s"
          :path="`M660 ${f.y} C 700 ${f.y}, 710 ${MID}, 720 ${MID}`" />
      </circle>
    </g>

    <!-- ===== nós =====
         font-size via style inline (px = unidades do viewBox, escala junto) vence o CSS do tema -->
    <!-- Aplicação -->
    <rect x="20" :y="MID - 32" width="130" height="64" rx="10" fill="#1f2937" stroke="#4b5563" />
    <text x="85" :y="MID - 4" fill="#e5e7eb" text-anchor="middle" style="font-size:15px">aplicação</text>
    <text x="85" :y="MID + 16" fill="#9ca3af" text-anchor="middle" style="font-size:12px">SDK / OTel</text>

    <!-- Collector -->
    <rect x="250" :y="MID - 38" width="140" height="76" rx="10" fill="#111827" stroke="#6b7280" />
    <text x="320" :y="MID - 4" fill="#e5e7eb" text-anchor="middle" style="font-size:14px">OpenTelemetry</text>
    <text x="320" :y="MID + 16" fill="#9ca3af" text-anchor="middle" style="font-size:12px">Collector</text>

    <!-- backends -->
    <g v-for="f in flows" :key="`node-${f.id}`">
      <rect x="500" :y="f.y - 28" width="160" height="56" rx="10" fill="#1f2937" :stroke="f.color" />
      <image :href="`${base}${f.icon}-icon.svg`" x="514" :y="f.y - 16" width="32" height="32" />
      <text x="556" :y="f.y - 2" :fill="f.color" style="font-size:15px;font-weight:700">{{ f.backend }}</text>
      <text x="556" :y="f.y + 16" fill="#9ca3af" style="font-size:11px">{{ f.label }}</text>
    </g>

    <!-- Grafana -->
    <rect x="720" :y="MID - 38" width="84" height="76" rx="10" fill="#181b1f" stroke="#f46800" />
    <image :href="`${base}grafana-icon.svg`" x="746" :y="MID - 28" width="32" height="32" />
    <text x="762" :y="MID + 22" fill="#f46800" text-anchor="middle" style="font-size:13px;font-weight:700">Grafana</text>
  </svg>
</template>

<style scoped>
.svg-flow text { font-family: ui-sans-serif, system-ui, sans-serif; }
</style>
