# AstralLeap 使用手册

本项目使用 [VitePress](https://vitepress.dev/) 构建的个人知识花园，包含知识库、实验记录、Debug 记录、命令速查等模块。

所有内容模块均为**自动扫描、动态生成**，你只需要往对应目录放 `.md` 文件，列表就会自动更新。

下文提到的 `knowledge/`、`experiments/`、`debug/` 和 `cheatsheet/` 等内容目录均位于 `src/` 下。

---

## 快速开始

### 启动开发服务器

```bash
npm run docs:dev
```

访问 `http://localhost:5173/AstralLeap/` 预览效果。

### 构建静态站点

```bash
npm run docs:build
```

构建产物在 `.vitepress/dist/` 目录。

### 本地预览构建结果

```bash
npm run docs:preview
```

---

## 整体架构

```
知识花园
├── 📚 技术知识库     — 系统化技术知识，按分类组织
│   ├── 嵌入式 Linux
│   ├── Linux 驱动开发
│   ├── Camera / V4L2
│   ├── 视频编解码
│   ├── 音频
│   ├── AI / NPU
│   ├── 网络通信
│   └── 思考随笔       — 学习方法、技术思考、项目复盘
├── 🧪 实验记录       — 动手验证的记录（编号式）
├── 🐛 Debug 记录     — 问题排查过程与解决方案
├── ⚡ 命令速查       — 常用命令 / API 速查表
└── 📁 项目展示       — 项目作品展示
```

---

## 通用规范（所有模块都要注意）

### ✅ 必做

- **frontmatter 必须放在文件最顶部**，前面不能有空行或其他内容
- **`title` 必填**，列表显示全靠它
- **文件名用英文小写 + 连字符**（kebab-case），如 `v4l2-mmap.md`
- **日期格式统一用 `YYYY-MM-DD`**，如 `2026-09-26`
- **正文一级标题和 frontmatter 的 title 保持一致**

### ❌ 不要做

- 不要把 `index.md` 当普通文章写（它会被自动跳过，不会出现在列表里）
- 不要用中文文件名（URL 会编码，不美观）
- 不要在 frontmatter 里写没有定义的字段（不会报错但也没用）
- 不要用 `xxx copy.md`、`新建文本文档.md` 这种临时文件名

### 📐 frontmatter 基本格式

```markdown
---
title: 标题
description: 一句话描述（列表中显示）
date: 2026-09-26
tags:
  - 标签1
  - 标签2
---

# 标题

正文从这里开始...
```

> 💡 `description` 很重要，列表卡片上的副标题全靠它。没有的话卡片会显得很空。

---

## 各模块添加方式与注意事项

### 📚 知识库

知识库按分类存放在 `knowledge/<分类名>/` 目录下。**分类是自动发现的**，新建一个子目录 + `index.md` 就会自动出现在列表中。

#### 添加一篇新文章

1. 在对应分类目录创建 `.md` 文件（文件名就是 URL 的一部分，建议用英文 slug）
2. 顶部写 frontmatter
3. 写正文内容

**示例**：`knowledge/camera/isp-basics.md`

```markdown
---
title: ISP 图像信号处理
description: ISP 各模块原理与调优方法
date: 2026-09-21
tags:
  - ISP
  - 3A
  - 图像质量
platform:
  - 通用
status: learning    # learning / done
difficulty: intermediate
---

# ISP 图像信号处理

正文内容...
```

**frontmatter 字段说明**：

| 字段            | 必填 | 说明                                             | 示例                 |
| --------------- | ---- | ------------------------------------------------ | -------------------- |
| `title`       | ✅   | 文章标题                                         | `ISP 图像信号处理` |
| `description` | -    | 简短描述（列表中显示）                           | `ISP 各模块原理`   |
| `date`        | -    | 日期，用于排序                                   | `2026-09-21`       |
| `tags`        | -    | 标签数组                                         | `- ISP`            |
| `status`      | -    | 状态：`learning` / `done`                    | `learning`         |
| `platform`    | -    | 适用平台                                         | `- RV1106G2`       |
| `difficulty`  | -    | 难度：`beginner`/`intermediate`/`advanced` | `intermediate`     |

> 💡 保存文件后，自动出现在：首页技术知识库标签 → 技术知识库首页分类卡片 → 分类文章列表

#### ⚠️ 知识库注意事项

1. **文章放在分类目录下，不要直接放 knowledge/ 根目录**，否则不会被任何分类收录
2. **0 篇文章的空分类不会显示在首页和技术知识库首页**（避免点进去是空的尴尬）
3. **分类排序按文章数量倒序**，文章多的分类排在前面
4. **分类内的文章按日期倒序**，最新的在最上面
5. `status: learning` 表示学习中/未完，`status: done` 表示已完成，列表中会显示不同的标签颜色

#### 新增一个分类

在 `knowledge/` 下新建一个子目录 + `index.md` 即可，**不需要改任何组件代码**。

**步骤**：

1. 新建目录，比如 `knowledge/tools/`
2. 在目录下创建 `index.md`，写 frontmatter（分类名称、图标、描述都从这里读）

**示例**：`knowledge/tools/index.md`

```markdown
---
title: 开发工具
icon: 🛠️
description: 常用开发工具和效率技巧
---

# 🛠️ 开发工具

> 常用开发工具和效率技巧。
> 自动扫描本分类下所有文章，按日期倒序排列。

---

<KnowledgeArticleList category="tools" />

<script setup>
import KnowledgeArticleList from '../../../.vitepress/components/KnowledgeArticleList.vue'
</script>
```

**index.md frontmatter 字段**：

| 字段            | 必填 | 说明                           |
| --------------- | ---- | ------------------------------ |
| `title`       | ✅   | 分类名称（显示在卡片和标签上） |
| `icon`        | ✅   | 分类图标（emoji）              |
| `description` | -    | 分类描述                       |

> ⚠️ **新增分类后记得加侧边栏**：分类卡片和标签是自动发现的，但侧边栏导航需要手动在 `.vitepress/config.mjs` 中添加（保持排序可控）。

---

### ✍️ 思考随笔

「思考随笔」是知识库的一个分类（`knowledge/thoughts/`），存放非技术教程类的内容：学习方法、技术思考、项目复盘、读书笔记等。

**添加一篇随笔**：

1. 在 `knowledge/thoughts/` 目录创建 `.md` 文件
2. 顶部写 frontmatter
3. 写正文

**示例**：`knowledge/thoughts/my-learning-method.md`

```markdown
---
title: 我的嵌入式学习方法
description: 分享我学习嵌入式开发的一些方法和心得
date: 2026-09-21
tags:
  - 学习方法
  - 嵌入式
status: done
---

# 我的嵌入式学习方法

正文内容...
```

> 💡 **和技术文章的区别**：技术文章讲「是什么、怎么用」，随笔讲「怎么学、怎么想」。拿不准放哪的时候，问自己：这篇文章是教别人一个技术点，还是分享自己的想法？

---

### 🧪 实验记录

实验记录放在 `experiments/` 目录下。

**命名规范**：`编号-简短名称.md`，如 `023-isp-tuning.md`

**添加一篇实验记录**：

1. 在 `experiments/` 目录创建 `.md` 文件
2. 文件名以编号开头（如 `023-xxx.md`）
3. 顶部写 frontmatter
4. 按模板写正文

**示例**：`experiments/023-isp-ae-test.md`

```markdown
---
title: ISP AE 自动曝光调优实验
description: 调整 AE 参数，对比不同曝光策略下的画质表现
date: 2026-09-21
category:
  - Camera
tags:
  - ISP
  - AE
  - 曝光
platform:
  - RV1106G2
status: doing      # done / doing
difficulty: intermediate
---

# #023 · ISP AE 自动曝光调优实验

## 实验目标

...
```

**frontmatter 字段说明**：

| 字段            | 必填 | 说明                                    |
| --------------- | ---- | --------------------------------------- |
| `title`       | ✅   | 实验名称                                |
| `description` | -    | 简短描述                                |
| `date`        | -    | 日期                                    |
| `status`      | -    | `done`（已验证）/ `doing`（进行中） |
| `platform`    | -    | 实验平台                                |
| `tags`        | -    | 标签数组                                |
| `category`    | -    | 分类                                    |

#### ⚠️ 实验记录注意事项

1. **编号建议连续递增**，方便按顺序查阅和追踪进度
2. **编号补零到 3 位**（如 `001`、`023`、`100`），排序不会乱
3. **标题建议以「实验」二字结尾**，列表里一眼就能看出是实验
4. **`status: done` 表示实验做完验证通过了，`doing` 表示还在做**
5. 实验做完后，记得在对应的**知识库文章末尾加「相关实验」链接**，形成知识网络
6. **不是所有操作都要写实验记录**——纯理论学习、跑个 hello world 就不用写了，直接放知识库就行

#### 实验 vs 知识库：怎么选？

| 情况                               | 放哪里                |
| ---------------------------------- | --------------------- |
| 讲原理、讲概念、总结用法           | 📚 知识库             |
| 真的在板子上跑了、有具体命令和输出 | 🧪 实验记录           |
| 有实验数据对比（帧率、画质、延迟） | 🧪 实验记录           |
| 踩了坑、有调试过程                 | 🐛 Debug 记录         |
| 内容很少，一两段话就说完了         | 📚 知识库（不用硬拆） |

> 💡 **推荐流程**：先写知识库笔记学理论 → 动手做实验 → 写实验记录 → 回头在知识库文章里加实验链接

---

### 🐛 Debug 记录

Debug 记录放在 `debug/` 目录下。

**添加一篇 Debug 记录**：

1. 在 `debug/` 目录创建 `.md` 文件
2. 文件名描述问题（如 `sensor-no-signal.md`）
3. 顶部写 frontmatter
4. 按排查过程写正文

**示例**：`debug/sensor-no-signal.md`

```markdown
---
title: Sensor 无信号输出
description: Sensor 上电正常但 MIPI 无数据输出
date: 2026-09-21
category:
  - Camera / Sensor
tags:
  - Sensor
  - MIPI
  - 电源
platform:
  - RV1106G2
status: debugging   # solved / debugging
---

# Sensor 无信号输出

## 现象

...
```

**frontmatter 字段说明**：

| 字段            | 必填 | 说明                                          |
| --------------- | ---- | --------------------------------------------- |
| `title`       | ✅   | 问题标题                                      |
| `description` | -    | 简短描述                                      |
| `date`        | -    | 日期                                          |
| `status`      | -    | `solved`（已解决）/ `debugging`（排查中） |
| `category`    | -    | 分类（显示在列表中）                          |
| `platform`    | -    | 平台                                          |
| `tags`        | -    | 标签数组                                      |

Camera、V4L2、MPP 等分类导航页使用 `categoryPage: true`，这样不会混入 Debug 记录列表。

#### ⚠️ Debug 记录注意事项

1. **文件名直接描述问题**，比如 `v4l2-dqbuf-timeout.md`，别用 `bug1.md`、`debug-2026.md`
2. **按排查顺序写**：现象 → 排查过程 → 根因 → 解决方案 → 总结
3. **`status: solved` 用绿色标签，`debugging` 用橙色标签**，列表里一眼能看出问题状态
4. **解决了就及时改 status**，别一直挂着「排查中」
5. 建议在文末加「相关知识」「相关实验」链接，方便回头复习
6. **小问题不用写 Debug 记录**，一两句话能说清的直接写在知识库文章的「常见问题」里就行

---

### ⚡ 命令速查

速查表放在 `cheatsheet/` 目录下。

**添加一张速查表**：

1. 在 `cheatsheet/` 目录创建 `.md` 文件
2. 文件名用英文名称（如 `vim.md`）
3. 顶部写 frontmatter
4. 写命令速查内容

**示例**：`cheatsheet/vim.md`

```markdown
---
title: Vim 命令速查
description: Vim 常用命令、模式切换、快捷键速查表
---

# 📝 Vim 命令速查

## 模式切换

```bash
i    # 进入插入模式
Esc  # 回到普通模式
v    # 进入可视模式
:    # 进入命令行模式
```

...

```

**frontmatter 字段说明**：

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 速查表名称 |
| `description` | - | 简短描述（卡片中显示） |

#### ⚠️ 速查表注意事项

1. **文件名决定图标**——常见名称（`linux`、`v4l2`、`ffmpeg`、`git`、`vim`、`docker`、`ssh`、`gdb`）有预设图标，其他的显示默认 📋 图标
2. **内容要精炼**，速查表是用来「翻」的，不是用来「读」的，只放命令和简短说明
3. **用代码块 + 注释**的格式，一目了然
4. **命令按功能分组**，每组一个小标题，方便快速定位

---

## Markdown 扩展语法

VitePress 支持一些额外的 Markdown 语法：

### 代码块标题

````markdown
```bash title="查看设备信息"
v4l2-ctl -d /dev/video0 --all
```

````

### 自定义容器

```markdown
::: tip 提示
这是一条提示信息。
:::

::: warning 警告
这是一条警告信息。
:::

::: danger 危险
这是一条危险警告。
:::

::: details 点击展开
这里是折叠内容。
:::
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|---|---|---|
| A | B | C |
```

---

## 常见问题

### Q: 新建的文章没有出现在列表里？

A: 检查以下几点：
1. 文件放在正确的目录下
2. 文件名以 `.md` 结尾
3. 不是 `index.md`（index.md 会被自动跳过）
4. 开发服务器需要刷新一下页面（或等待热更新）

### Q: 新建的分类没有出现在首页？

A: 检查：
1. 分类目录下有 `index.md` 吗？没有的话系统找不到分类名称
2. `index.md` 的 frontmatter 里有 `title` 和 `icon` 吗？
3. 分类下有文章吗？**0 篇文章的分类会被隐藏**
4. 如果以上都没问题，刷新页面试试

### Q: frontmatter 怎么写才对？

A: 用 `---` 包裹，放在文件最顶部，格式如下：

```markdown
---
title: 标题
date: 2026-09-21
tags:
  - 标签1
  - 标签2
---

正文从这里开始...
```

### Q: 怎么添加图片？

A: 可以把图片放在 `src/public/` 目录下，然后用 `/AstralLeap/图片名.png` 引用。或者放在文章同级目录，用相对路径引用。

### Q: 搜索功能怎么用？

A: VitePress 内置了本地搜索，直接在顶部搜索框输入关键词即可。所有 Markdown 内容都会被索引。

### Q: 怎么部署到 GitHub Pages？

A: 构建后把 `.vitepress/dist/` 目录的内容推送到 `gh-pages` 分支即可。也可以用 GitHub Actions 自动部署。

### Q: 知识库新增分类后侧边栏不显示？

A: 分类卡片和标签是自动发现的，但侧边栏导航需要手动在 `.vitepress/config.mjs` 中添加，这样可以控制分类的显示顺序。

### Q: 写完文章要提交代码吗？

A: 看你自己。本地写完直接 `npm run docs:dev` 就能看效果。想同步到 GitHub 或者部署到 Pages 的时候再提交推送就行。

---

## 配置参考

主要配置文件是 `.vitepress/config.mjs`，常用配置项：

| 配置项 | 说明 |
|---|---|
| `title` | 站点标题 |
| `description` | 站点描述 |
| `base` | 部署路径（如 `/AstralLeap/`） |
| `nav` | 顶部导航栏 |
| `sidebar` | 侧边栏配置 |

更多配置请参考 [VitePress 官方文档](https://vitepress.dev/)。
````
