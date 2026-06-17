import { defineShikiSetup } from '@slidev/types'

export default defineShikiSetup(() => {
  return {
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
    // PromQL e LogQL não têm gramática própria no bundle do Shiki.
    // Reaproveitamos gramáticas existentes que destacam bem a sintaxe.
    langAlias: {
      promql: 'sql',
      logql: 'sql',
    },
  }
})
