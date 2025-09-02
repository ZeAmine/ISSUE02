<script setup lang="ts">
const router = useRouter()
const { setPreviousRoute, setCurrentRoute } = useAppStore()

watch(
  () => router.currentRoute.value,
  (to, from): void => {
    if (from?.path) setPreviousRoute(from?.path)
    if (to?.path) setCurrentRoute(to?.path)
  },
  { immediate: true }
)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
