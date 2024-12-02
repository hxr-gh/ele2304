<script lang="ts" setup>
import type { ILoginInfo } from '@/types'
import { useAuth } from '@/use/useAuth'
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const onClickLeft = () => history.back() //点击回退

const { login } = useAuth() //验证的Hooks

//点击提交
const onSubmit = async (data: ILoginInfo) => {
  await login(data) //调用登录的方法
  onClickLeft() //调用回退的方法
}
</script>

<template>
  <!-- 登录 -->
  <div class="login-page op-fullscreen">
    <!-- 顶部 -->
    <VanNavBar title="请登录" left-text="返回" left-arrow @click-left="onClickLeft"></VanNavBar>
    <!-- 底部 -->
    <VanForm class="login-page__form" @submit="onSubmit">
      <!-- 表单项 -->
      <VanCellGroup inset>
        <!-- 用户名 -->
        <VanField
          v-model="username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        ></VanField>
        <!-- 密码 -->
        <VanField
          v-model="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        ></VanField>
      </VanCellGroup>
      <!-- 提交按钮 -->
      <div style="margin: 16px">
        <VanButton round block type="primary" native-type="submit">提交</VanButton>
      </div>
    </VanForm>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  .login-page__form {
    margin-top: 100px;
  }
}
</style>
