# AstralLeap 使用手册

这是个人知识库与项目展示站。写下已学习、已实践、已确认的内容即可；不需要把笔记写成面向他人的教程。站点使用 VitePress，内容在 `src/`，配置在 `.vitepress/`。

## 内容扩展原则

**新增文章只需把 `.md` 文件放到对应目录，列表、侧边栏和搜索索引自动更新，不需要编辑其他文章、组件或导航配置。** 栏目目录下可以继续创建子目录来整理文章；分类首页与导航页不作为普通文章计数。

- 项目文章：放到 `src/projects/<项目>/` 或其子目录，自动进入项目侧边栏。已有 `project.json.sidebar` 只用于自定义分组、顺序和名称；未登记文章会自动补充。
- 新知识分类：添加分类目录、`index.md` 和文章。分类首页提供元信息和文章列表组件，侧边栏自动生成；卡片只展示有文章的分类。
- 新实验、Debug 或速查文章：放到对应栏目目录或子目录，列表和侧边栏递归发现。Debug 文章放到 `debug/camera/`、`debug/mpp/` 或 `debug/v4l2/` 时，也会自动进入对应分类页，无需修改记录表格。

新增文章与创建全新的栏目、分类或项目是两回事。新知识分类仍需设置一次分类首页，新项目展示卡片仍由 `project.json` 提供介绍，新增顶级栏目仍需配置全站导航。现有位置下添加文章不需要这些操作。开发服务器会随文件新增、修改和删除刷新列表及导航，正式站点在正常构建部署后更新。

## 本地预览与发布

在仓库根目录运行：

```bash
npm ci
npm run docs:dev
```

开发服务器默认地址为 `http://localhost:5173/AstralLeap/`。修改笔记后刷新页面即可查看。发布前运行：

```bash
npm run docs:build
npm run docs:preview
```

构建产物在 `.vitepress/dist/`。推送到 `master` 后，`.github/workflows/deploy.yml` 中的 GitHub Actions 工作流会构建并部署到 GitHub Pages；仓库的 **Settings → Pages → Source** 应设为 **GitHub Actions**。

## 内容放在哪里

| 内容 | 目录 | 适合记录 |
| --- | --- | --- |
| 知识笔记 | `src/knowledge/<分类>/` | 概念、原理、用法与个人理解 |
| 实验记录 | `src/experiments/` | 环境、步骤、结果与结论 |
| Debug 记录 | `src/debug/` | 现象、排查过程、根因与处理 |
| 命令速查 | `src/cheatsheet/` | 常用命令和简短说明 |
| 项目展示 | `src/projects/<项目>/` | 项目介绍、实现资料与进展 |

已有分类和示例比空模板更有参考价值。拿不准放哪里时，先按内容的主要用途选择目录；一篇笔记不必为了凑齐栏目而拆成多篇。

## 写一篇笔记

在对应目录创建 `.md` 文件。普通笔记建议使用英文小写文件名和连字符，例如 `v4l2-mmap.md`；项目目录中现有的中文文件名可以继续使用。

```markdown
---
title: V4L2 MMAP 采集笔记
description: 记录缓冲区申请、映射和取帧过程
date: 2026-09-30
tags:
  - V4L2
  - MMAP
status: learning
---

# V4L2 MMAP 采集笔记

## 这次弄清了什么

记录自己的理解与验证结果。
```

`title` 可选；缺省时列表和导航读取正文的一级标题，再缺省才显示文件名。无需 frontmatter 也能添加文章。`description` 用于列表摘要，缺省时会尝试从正文提取。`date` 用 `YYYY-MM-DD` 格式，列表按日期倒序；没有日期的文章排在后面。`tags`、`platform`、`difficulty` 都是可选字段。常用 `status`：知识笔记用 `learning` / `done`，实验用 `doing` / `done`，Debug 用 `debugging` / `solved`。

不要把占位文字或未经验证的结果写成已完成内容。实验尚未完成时保留实际观察结果，并使用 `doing`；问题还没解决时使用 `debugging`。

### 知识库分类

知识文章放在 `src/knowledge/<分类>/`，分类目录中的 `index.md` 是分类首页，不计入文章列表。分类首页的 frontmatter 提供名称、图标和描述：

```yaml
---
title: 开发工具
icon: 🛠️
description: 常用工具笔记
---
```

分类首页需要放入文章列表组件，例如 `src/knowledge/tools/index.md`：

```markdown
<script setup>
import KnowledgeArticleList from '../../../.vitepress/components/KnowledgeArticleList.vue'
</script>

<KnowledgeArticleList category="tools" />
```

`category` 与分类目录名保持一致。侧边栏会自动发现分类及文章，**无需修改 `.vitepress/config.mjs`**。分类卡片和首页标签会自动发现**至少有一篇文章**的分类；只有 `index.md` 的空分类不会出现在这些卡片中。

### 实验与 Debug

实验文件建议按现有习惯编号，例如 `023-isp-test.md`。写清实际使用的板卡与软件版本、操作步骤、预期和实际结果。Debug 文件名建议直接描述问题，例如 `v4l2-dqbuf-timeout.md`；记录排查证据，解决后再把 `status` 改为 `solved`。

实验、Debug 和速查页面的列表会递归扫描对应目录及子目录的 Markdown 文件。各级 `index.md` 与 `categoryPage: true` 导航页不会作为普通文章出现。左侧导航自动更新，无需在 `.vitepress/config.mjs` 中逐篇登记。Debug 分类页按 `category`（支持数组）匹配；未填写时按分类子目录自动匹配，例如 `src/debug/camera/new-note.md` 自动进入 Camera 分类。

## 添加项目

每个项目放在 `src/projects/` 下的独立目录中，如 `6-new-project/`。目录里的 `project.json` 提供项目卡片和可选的侧边栏排序；项目正文仍是普通 Markdown 文件。

```json
{
  "icon": "🔧",
  "name": "项目名称",
  "gradient": "linear-gradient(135deg, #7aa2f7, #bb9af7)",
  "tech": ["Linux", "C"],
  "desc": "一句话说明已经做出的内容",
  "status": "进行中",
  "link": "/projects/6-new-project/项目介绍",
  "sidebar": [
    { "text": "项目介绍", "link": "项目介绍" }
  ]
}
```

同时创建 `src/projects/6-new-project/项目介绍.md`。`link` 指向卡片点击后的页面，不写 `.md` 或 `.html`；侧边栏中的 `link` 相对于项目目录，也不写后缀。链接指向的 Markdown 文件必须存在。项目卡片按目录开头的数字倒序排列。

已有项目中新增文章时，只需添加 `.md` 文件；无需更新 `sidebar`，新文章会自动追加到侧边栏。

只要存在 `project.json`，项目就会出现在展示列表中。暂时不想展示的构思或空白页，可以先留在本地记录，等有可展示的内容再添加 `project.json`。项目配置的更多字段可参考已有项目。

## Markdown 常用写法

### 图片与附件

把与文章相关的图片放在文章附近，可用相对路径引用：

```markdown
![采集结果](./images/capture.png)
```

全站共用的图标等资源放在 `src/public/`。引用前确认文件已经加入仓库，并在构建后检查页面中的图片是否正常显示。

### 代码块标题

````markdown
```bash title="查看设备信息"
v4l2-ctl -d /dev/video0 --all
```
````

### 提示与折叠内容

```markdown
::: tip 备忘
记录容易忘记的前提条件。
:::

::: details 排查过程
这里写较长的日志或过程。
:::
```

## 常见问题

**新文章没有出现在列表？** 检查目录是否正确、文件是否为 `.md`、是否误用了 `index.md`，再刷新开发页面或重新构建。

**新分类没有出现在首页？** 检查分类目录是否有 `index.md` 和至少一篇文章。分类卡片与侧边栏会自动生成，不用手动登记入口。

**项目卡片打开后是 404？** 检查 `project.json` 中的 `link` 与实际 Markdown 文件名是否一致，并运行 `npm run docs:build`。

**搜索不到代码内容？** 本站的本地搜索会跳过冗长的代码块正文；为笔记写清标题、小标题和描述，代码块可添加 `title`。

**修改后怎样上线？** 本地确认后提交并推送到 `master`。部署由 GitHub Actions 完成，无需手动提交 `.vitepress/dist/`。
