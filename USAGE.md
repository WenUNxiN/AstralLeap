# AstralLeap 使用手册

本项目使用 [VitePress](https://vitepress.dev/) 构建的个人知识花园，包含知识库、实验记录、Debug 记录、命令速查等模块。

所有内容模块均为**自动扫描、动态生成**，你只需要往对应目录放 `.md` 文件，列表就会自动更新。

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
├── 📚 知识库         — 系统化技术知识，按分类组织
│   ├── Camera / V4L2
│   ├── 视频编解码
│   ├── 驱动开发
│   ├── Linux 系统编程
│   ├── 网络 / RTSP
│   ├── AI / NPU
│   ├── 音频
│   └── 思考随笔       — 学习方法、技术思考、项目复盘
├── 🧪 实验记录       — 动手验证的记录（编号式）
├── 🐛 Debug 记录     — 问题排查过程与解决方案
├── ⚡ 命令速查       — 常用命令 / API 速查表
└── 📁 项目展示       — 项目作品展示
```

---

## 目录结构

```
AstralLeap/
├── index.md                  # 首页
├── about.md                  # 关于页面
├── knowledge/                # 📚 知识库（分类自动发现）
│   ├── index.md              # 知识库首页（动态分类卡片）
│   ├── camera/               # Camera / V4L2 分类
│   │   ├── index.md          # 分类首页（动态文章列表）
│   │   ├── v4l2.md           # 具体文章
│   │   ├── sensor.md
│   │   └── ...
│   ├── video/                # 视频编解码分类
│   ├── driver/               # 驱动开发分类
│   ├── linux/                # Linux 系统编程分类
│   ├── network/              # 网络 / RTSP 分类
│   ├── ai/                   # AI / NPU 分类
│   ├── audio/                # 音频分类
│   ├── thoughts/             # 思考随笔（非技术教程类）
│   └── ...                   # 新增分类：建目录 + index.md 即可
├── experiments/              # 🧪 实验记录
│   ├── index.md              # 实验首页（动态列表）
│   ├── 022-v4l2-mmap.md      # 实验记录（编号+短名）
│   ├── 021-camera-i2c.md
│   └── ...
├── debug/                    # 🐛 Debug 记录
│   ├── index.md              # Debug 首页（动态列表）
│   ├── v4l2-dqbuf-timeout.md # 具体 Debug 记录
│   └── ...
├── cheatsheet/               # ⚡ 命令速查
│   ├── index.md              # 速查首页（动态卡片）
│   ├── linux.md              # Linux 速查表
│   ├── v4l2.md
│   └── ...
├── projects/                 # 📁 项目展示
│   └── ...
├── doc/                      # 📄 历史文档
│   └── ...
└── .vitepress/
    ├── config.mjs            # 站点配置
    ├── components/           # Vue 组件
    └── utils/                # 工具函数
```

---

## 各模块添加方式

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

| 字段 | 必填 | 说明 | 示例 |
|---|---|---|---|
| `title` | ✅ | 文章标题 | `ISP 图像信号处理` |
| `description` | - | 简短描述（列表中显示） | `ISP 各模块原理` |
| `date` | - | 日期，用于排序 | `2026-09-21` |
| `tags` | - | 标签数组 | `- ISP` |
| `status` | - | 状态：`learning` / `done` | `learning` |
| `platform` | - | 适用平台 | `- RV1106G2` |
| `difficulty` | - | 难度：`beginner`/`intermediate`/`advanced` | `intermediate` |

> 💡 保存文件后，自动出现在：首页知识库标签 → 知识库首页分类卡片 → 分类文章列表

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
import KnowledgeArticleList from '../../.vitepress/components/KnowledgeArticleList.vue'
</script>
```

**index.md frontmatter 字段**：

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 分类名称（显示在卡片和标签上） |
| `icon` | ✅ | 分类图标（emoji） |
| `description` | - | 分类描述 |

> 💡 保存后，分类自动出现在首页知识库标签和知识库首页分类卡片中，文章数量自动统计。
>
> ⚠️ 侧边栏导航需要手动在 `.vitepress/config.mjs` 中添加（保持排序可控）。

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

**frontmatter 字段说明**：

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 文章标题 |
| `description` | - | 简短描述（列表中显示） |
| `date` | - | 日期 |
| `tags` | - | 标签数组 |
| `status` | - | `done` / `writing` |

> 💡 随笔和技术文章的区别：技术文章讲「是什么、怎么用」，随笔讲「怎么学、怎么想」。

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

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 实验名称 |
| `description` | - | 简短描述 |
| `date` | - | 日期 |
| `status` | - | `done`（已验证）/ `doing`（进行中） |
| `platform` | - | 实验平台 |
| `tags` | - | 标签数组 |
| `category` | - | 分类 |

> 💡 实验编号建议连续递增，方便检索和追踪。文件保存后，自动出现在首页和实验列表页（按日期倒序）。

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

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 问题标题 |
| `description` | - | 简短描述 |
| `date` | - | 日期 |
| `status` | - | `solved`（已解决）/ `debugging`（排查中） |
| `category` | - | 分类（显示在列表中） |
| `platform` | - | 平台 |
| `tags` | - | 标签数组 |

> 💡 建议在文章末尾加「相关知识」「相关实验」链接，形成知识网络。

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

> 💡 速查表图标根据文件名自动匹配（部分常见名称有预设图标）。

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

A: 可以把图片放在 `.vitepress/public/` 目录下，然后用 `/AstralLeap/图片名.png` 引用。或者放在文章同级目录，用相对路径引用。

### Q: 搜索功能怎么用？

A: VitePress 内置了本地搜索，直接在顶部搜索框输入关键词即可。所有 Markdown 内容都会被索引。

### Q: 怎么部署到 GitHub Pages？

A: 构建后把 `.vitepress/dist/` 目录的内容推送到 `gh-pages` 分支即可。也可以用 GitHub Actions 自动部署。

### Q: 知识库新增分类后侧边栏不显示？

A: 分类卡片和标签是自动发现的，但侧边栏导航需要手动在 `.vitepress/config.mjs` 中添加，这样可以控制分类的显示顺序。

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
