// 搜索框

<script lang="ts" setup>
//声明属性
interface IProps {
  showAction?: boolean //是否展示
  background?: string //背景色
  placeholder?: string //提示信息
  shape?: string //形状
  modelValue?: string | number //值
}
const props = defineProps<IProps>()
//声明事件
interface IEmits {
  (e: 'search', v?: string | number): void //搜索
  (e: 'cancel'): void //取消
  (e: 'clear'): void //清空
  (e: 'update:modelValue', v?: string | number): void //更新
  (e: 'inputClick'): void //
}
const emits = defineEmits<IEmits>()
//按回车键
const onKeypress = (e: KeyboardEvent) => {
  const ENTER_CODE = 13
  if (e.keyCode === ENTER_CODE) {
    e.preventDefault()
    emits('search', props.modelValue)
  }
}
//点击清空
const onClear = () => {
  emits('update:modelValue', '')
  emits('clear')
}
</script>

<template>
  <div class="op-search" :class="{ 'op-seatch--show-action': showAction }" :style="{ background }">
    <div class="op-search__content" :class="shape ? `op-search__content--${shape}` : ''">
      <div class="op-cell op-seatch__field">
        <!-- 左侧放大镜小图标 -->
        <div class="op-field__left-icon">
          <VanIcon name="search"></VanIcon>
        </div>
        <!-- 右侧主体 -->
        <div class="op-cell__value">
          <div class="op-field__body">
            <!-- 输入框 -->
            <input
              class="op-field__control"
              type="search"
              :value="modelValue"
              :placeholder="placeholder"
              @keypress="onKeypress"
              @input="e => emits('update:modelValue', (e.target as HTMLInputElement).value)"
              @click="emits('inputClick')"
            />
            <!-- 搜索 -->
            <div v-if="$slots['right-icon']" class="op-field__right-icon">
              <slot name="right-icon"></slot>
            </div>
            <!-- x -->
            <VanIcon
              v-else-if="modelValue"
              name="clear"
              class="op-field__clear"
              @click="onClear"
            ></VanIcon>
          </div>
        </div>
      </div>
    </div>
    <!-- 取消 -->
    <div v-if="showAction" class="op-search__action">
      <slot name="action">
        <div @click="emits('cancel')">取消</div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
//:root代表根标签
:root {
  //以--开头表示定义样式的变量名，--op是自己起的变量名，--van是vant-ui中的变量名，var指使用
  --op-search-padding: 10px var(--van-padding-sm);
  --op-search-background-color: var(--van-background-color-light);
  --op-search-content-background: var(--van-gray-1);
  --op-search-left-icon-color: var(--van-gray-6);
  --op-search-action-padding: 0 var(--van-padding-xs);
  --op-search-action-text-color: var(--van-text-color);
  --op-search-action-font-size: var(--van-font-size-md);
  --op-search-input-height: 34px;
}

.op-search {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: var(--op-search-padding);
  background: var(--op-search-background-color);

  &--show-action {
    padding-right: 0;
  }

  &__content {
    display: flex;
    flex: 1;
    padding-left: var(--van-padding-sm);
    background: var(--op-search-content-background);
    border-radius: var(--van-border-radius-sm);
    &--round {
      border-radius: var(--van-radius-max);
    }
  }

  &__action {
    padding: var(--op-search-action-padding);
    color: var(--op-search-action-text-color);
    font-size: var(--op-search-action-font-size);
    line-height: var(--op-search-input-height);
    cursor: pointer;
    user-select: none;
  }

  &__field {
    flex: 1;
    padding: 5px var(--van-padding-xs) 5px 0;
    background-color: transparent;

    .op-field__left-icon {
      color: var(--op-search-left-icon-color);
      margin-right: var(--van-padding-base);
      .van-icon {
        font-size: var(--van-field-icon-size);
      }
    }
  }
}

.op-cell {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  color: var(--van-cell-text-color);
  font-size: var(--van-cell-font-size);
  line-height: var(--van-cell-line-height);
  &__value {
    flex: 1;
    color: var(--van-cell-text-color);
    vertical-align: middle;
    word-wrap: break-word;
  }
}

.op-field {
  &__control {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    color: var(--van-field-input-text-color);
    line-height: inherit;
    text-align: left;
    background-color: transparent;
    resize: none;
    user-select: none;
    &::placeholder {
      color: var(--van-field-placeholder-text-color);
    }
  }
  &__body {
    display: flex;
    align-items: center;
  }
  &__right-icon {
    color: var(--van-field-right-icon-color);
    padding: 0 var(--van-padding-xs);
    line-height: inherit;
    flex-shrink: 0;
  }
  &__clear {
    color: var(--van-field-clear-icon-color);
    font-size: var(--van-field-clear-icon-size) !important;
    cursor: pointer;
  }
}

input {
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }
}
</style>
