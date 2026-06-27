---
title: TypeScript 类型体操入门
category: 嵌入式软件
date: 2024-01-18
author: Stellan W
views: 1890
---

# TypeScript 类型体操入门

从基础到进阶，系统学习 TypeScript 类型系统。

## 基础类型

```typescript
type StringOrNumber = string | number
type User = {
  id: number
  name: string
}
```

## 条件类型

```typescript
type IsString<T> = T extends string ? true : false
type Result = IsString<string> // true
```

## 映射类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

## 实战技巧

1. 使用 `extends` 进行类型约束
2. 使用 `infer` 提取类型参数
3. 利用条件类型实现类型转换

## 讨论区

<Discussion />

<script setup>
import Discussion from '../../.vitepress/components/Discussion.vue'
</script>
