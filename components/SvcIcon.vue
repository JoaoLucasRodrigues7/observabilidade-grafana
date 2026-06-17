<script setup lang="ts">
// Ícone de serviço servido a partir de /public.
// Usa BASE_URL para funcionar tanto em dev (/) quanto em subpasta (GitHub Pages).
defineProps<{ name: string }>()
const base = import.meta.env.BASE_URL
</script>

<template>
  <img :src="`${base}${name}-icon.svg`" :alt="name" class="inline-block object-contain" />
</template>
