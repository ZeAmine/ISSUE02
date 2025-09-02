<script setup lang="ts">
const canvas = ref<HTMLCanvasElement | null>(null)
const { isSupported } = useWebGL(canvas)
</script>

<template>
  <div class="gl">
    <canvas ref="canvas" />
    <div v-if="!isSupported" class="webgl-error">
      Your browser does not support WebGL
    </div>
  </div>
</template>
