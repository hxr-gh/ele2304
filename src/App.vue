<script setup lang="ts">
import { RouterView } from 'vue-router'
// import TabsView from './views/tabs/TabsView.vue'
import { fetchTest } from '@/api/test'
fetchTest()
</script>

<template>
  <router-view></router-view>
  <!-- <TabsView></TabsView> -->
</template>

<style scoped></style>
