import { defineNuxtPlugin } from '#app'
import { Grid } from '@/utils/Grid'

export default defineNuxtPlugin((nuxtApp) => {
  const gridInstance = new Grid({ col: 12 })

  return {
    provide: {
      grid: gridInstance
    }
  }
})
