<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute() //获取当前路由的状态
const router = useRouter() //获取路由的实例
const active = ref(route.name as string) //记录当前选中的tab

watch(active, nv => {
  router.push({
    name: nv
  })
})
</script>

<template>
  <router-view></router-view>
  <!-- <div class="center">{{ active }}</div> -->
  <VanTabbar v-model="active">
    <VanTabbarItem name="home" icon="home-o">首页</VanTabbarItem>
    <VanTabbarItem name="order" icon="bars">订单</VanTabbarItem>
    <VanTabbarItem name="me" icon="contact">我的</VanTabbarItem>
  </VanTabbar>
</template>

<style>
.center {
  text-align: center;
}
</style>
