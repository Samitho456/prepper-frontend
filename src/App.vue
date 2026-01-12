<script setup>
import { RouterView } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="layout">
    <Sidebar />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  overflow: auto;
}
</style>
