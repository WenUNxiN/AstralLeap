---
title: Vue3 组合式 API 最佳实践
category: 嵌入式软件
date: 2024-01-20
author: Stellan W
views: 3280
tags:
  - Vue3
  - JavaScript
  - 前端
---

# Vue3 组合式 API 最佳实践

深入探讨 Vue3 组合式 API 的使用模式。

## 什么是组合式 API

组合式 API 是 Vue3 引入的新特性，它允许我们使用函数来组织组件逻辑。

## 核心概念

### ref 和 reactive

```javascript
import { ref, reactive } from 'vue'

const count = ref(0)
const state = reactive({
  name: 'Astral Leap',
  version: '1.0.0'
})
```

### computed 和 watch

```javascript
import { computed, watch } from 'vue'

const doubled = computed(() => count.value * 2)

watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`)
})
```

## 最佳实践

1. 使用 `ref` 处理基本类型
2. 使用 `reactive` 处理对象
3. 提取可复用逻辑到组合函数
4. 合理使用 `computed` 缓存计算结果

## 讨论区

<Discussion />

<script setup>
import Discussion from '../../.vitepress/components/Discussion.vue'
</script>
