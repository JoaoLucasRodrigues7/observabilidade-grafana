<script setup lang="ts">
// Imagem servida a partir de /public, respeitando o BASE_URL.
// Usa :src dinâmico para o Vite não tentar importar o arquivo estaticamente
// (evita o erro "resolves outside of Vite server.fs.allow").
defineProps<{ name: string }>()
const base = import.meta.env.BASE_URL
</script>

<template>
  <img :src="`${base}${name}`" />
</template>
