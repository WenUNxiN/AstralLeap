# AstralLeap 使用手册

这是个人知识库与项目展示站。写下已学习、已实践、已确认的内容即可；不需要把笔记写成面向他人的教程。站点使用 VitePress，内容在 `src/`，配置在 `.vitepress/`。

## 探索与阅读

顶栏统一为「主页、探索、项目、关于」。首页的「最近记下的」按笔记日期汇集最新记录，无需维护清单；知识分类在项目预览前展示，首页项目预览只显示两个，规划和构思阶段的项目排在后面。项目展示页仍按原顺序显示全部项目。

「探索」汇集知识笔记、实验、Debug 和命令速查，支持按**技术主题 × 记录形式 × 进度**组合浏览，或搜索标题、摘要、标签等内容。排序、关键词和筛选会保存在地址参数中，可以分享链接，并用浏览器前进/后退恢复。

原有 `/knowledge/`、`/experiments/`、`/debug/`、`/cheatsheet/` 栏目页和全部文章 URL 继续有效，内容目录无需迁移。它们仍可作为某种记录形式的专门入口；顶栏和返回链接通过「探索」把不同形式连接起来。

宽主题从已有知识分类及各栏目第一级内容目录自动生成；文章的 `category` / `tags` 与主题名称或目录名相符时，会归入该主题。其余分类、标签及深层目录名称作为「细分标签」，可在当前主题与记录形式内继续筛选、搜索。主题不会因添加零散标签而不断膨胀，也不需要维护全站主题清单。没有元信息的平铺文章仍会进入「全部记录」及所属形式列表。未开始的兴趣只在关于页说明，有真实文章后才进入正常主题列表。

筛选数量按其他已选条件联动；无匹配的主题或形式会弱化。已选条件可以逐项移除，也可重置全部。标签筛选使用地址中的 `tag` 参数，旧的 `topic=细分标签` 链接继续有效。

进度按文章自己的 `status` 识别：“进行中”包括学习、实验和排查中的记录，“已完成”包括已验证和已解决的记录；未填写状态的笔记仍在“全部”中显示。进度使用可选的 `state=doing` 或 `state=done` 地址参数，不需要补写元信息才能添加笔记。

文章页的左侧目录对应当前主题、栏目或项目，右侧目录只列本页章节。正文上方的「相关主题」可以返回对应的探索筛选结果。「专注阅读」可以收起两侧目录；使用「退出专注」或 `Esc` 恢复。旁边的复制按钮可复制当前链接，包含地址中的筛选参数或章节锚点。相关文章仅按实际共同主题生成，没有匹配时不显示。

从探索进入文章后，左侧「返回探索」会保留进入时的主题、形式、标签、关键词、排序和列表位置；继续阅读相关文章时仍可返回原结果。当前标签页允许会话存储时，刷新文章也能保留这个入口。直接打开文章时，返回入口默认指向所属记录形式。浏览器前进、后退使用自身的历史位置恢复。

## 内容扩展原则

**新增文章只需把 `.md` 文件放到对应目录，列表、侧边栏和搜索索引自动更新，不需要编辑其他文章、组件或导航配置。** 栏目目录下可以继续创建子目录来整理文章；分类首页与导航页不作为普通文章计数。

- 项目文章：放到 `src/projects/<项目>/` 或其子目录，自动进入项目侧边栏。已有 `project.json.sidebar` 只用于自定义分组、顺序和名称；未登记文章会自动补充。
- 新知识分类：添加分类目录、`index.md` 和文章。分类首页提供元信息和文章列表组件，侧边栏自动生成；卡片只展示有文章的分类。
- 新实验、Debug 或速查文章：放到对应栏目目录或子目录，列表和侧边栏递归发现。Debug 文章放到 `debug/camera/`、`debug/mpp/` 或 `debug/v4l2/` 时，也会自动进入对应分类页，无需修改记录表格。

新增文章与创建全新的栏目、分类或项目是两回事。新知识分类仍需设置一次分类首页，新项目展示卡片仍由 `project.json` 提供介绍，新增顶级栏目仍需配置全站导航。现有位置下添加文章不需要这些操作。开发服务器会随文件新增、修改和删除刷新列表及导航，正式站点在正常构建部署后更新。

## 本地预览与发布

使用 **Node.js 24**（仓库的 `.nvmrc` 已声明版本），在仓库根目录运行：

```bash
npm ci
npm run docs:dev
```

开发服务器默认地址为 `http://localhost:5173/AstralLeap/`。修改笔记后页面会自动刷新。发布前运行：

```bash
npm test
npm run docs:build
npm run docs:preview
```

构建产物在 `.vitepress/dist/`。推送到 `master` 后，`.github/workflows/deploy.yml` 中的 GitHub Actions 工作流会构建并部署到 GitHub Pages；仓库的 **Settings → Pages → Source** 应设为 **GitHub Actions**。

构建结束会检查生成页面中的站内链接、图片/脚本资源和 HTML 锚点；如果目标缺失，输出会列出页面、链接与原因。修复后重新构建即可。

## 内容放在哪里

| 内容 | 目录 | 适合记录 |
| --- | --- | --- |
| 知识笔记 | `src/knowledge/<分类>/` | 概念、原理、用法与个人理解 |
| 实验记录 | `src/experiments/` | 环境、步骤、结果与结论 |
| Debug 记录 | `src/debug/` | 现象、排查过程、根因与处理 |
| 命令速查 | `src/cheatsheet/` | 常用命令和简短说明 |
| 项目展示 | `src/projects/<项目>/` | 项目介绍、实现资料与进展 |

拿不准放哪里时，先按内容的主要用途选择目录；一篇笔记不必为了凑齐栏目而拆成多篇。

## 可以直接复制的示例

仓库根目录的 `templates/` 提供了各类 Markdown 示例，详细用法见 `templates/README.md`。复制到对应的 `src/` 目录，改名并填写自己的内容即可。

`templates/已填写示例/知识笔记示例.md` 展示了一篇填写后的笔记，可以先看它，再按下面的类型选择模板。

| 示例文件 | 使用位置 |
| --- | --- |
| `templates/最简笔记.md` | 知识分类下的普通笔记，不需要 frontmatter |
| `templates/知识笔记.md` | `src/knowledge/<分类>/` |
| `templates/实验记录.md` | `src/experiments/` |
| `templates/Debug记录.md` | `src/debug/` |
| `templates/命令速查.md` | `src/cheatsheet/` |
| `templates/项目文档.md` | `src/projects/<项目>/` |
| `templates/知识分类首页.md` | 新分类目录中的 `index.md` |
| `templates/新项目示例/` | 新项目目录，包含 `project.json` 和 `index.md` |

模板目录不参与站点文章统计。章节与元信息都可按实际情况删减，模板日期需要改成自己的记录日期，未完成的内容可以保留未完成状态。

## 写一篇笔记

在对应目录创建 `.md` 文件。普通笔记建议使用英文小写文件名和连字符，例如 `v4l2-mmap.md`；项目目录中现有的中文文件名可以继续使用。避免在文件名中使用 `#`、`?` 或 `%` 等 URL 特殊字符；当前站点尚未完整支持这类文件名。

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

`category` 与分类目录名保持一致。`icon` 可选，新增分类可填写自定义 emoji；缺省时使用默认图标。侧边栏会自动发现分类及文章，**无需修改 `.vitepress/config.mjs`**。分类卡片和首页标签会自动发现**至少有一篇文章**的分类；只有 `index.md` 的空分类不会出现在这些卡片中。

### 实验与 Debug

实验文件建议按现有习惯编号，例如 `023-isp-test.md`。写清实际使用的板卡与软件版本、操作步骤、预期和实际结果。Debug 文件名建议直接描述问题，例如 `v4l2-dqbuf-timeout.md`；记录排查证据，解决后再把 `status` 改为 `solved`。

实验、Debug 和速查页面的列表会递归扫描对应目录及子目录的 Markdown 文件。各级 `index.md` 与 `categoryPage: true` 导航页不会作为普通文章出现。左侧导航自动更新，无需在 `.vitepress/config.mjs` 中逐篇登记。Debug 分类页按 `category`（支持数组）匹配；未填写时按分类子目录自动匹配，例如 `src/debug/camera/new-note.md` 自动进入 Camera 分类。

嵌套 Debug 分类使用相对于 `debug/` 的完整路径。例如 `debug/board/camera/index.md` 中使用 `<DebugCategoryList category="board/camera" />`；文章也可通过 `category: board/camera` 加入这个分类。不同目录下同名的分类各自独立。

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

`icon`、`gradient`、`tech` 等展示字段可以省略。未填写 `link` 时，项目卡片会依次选用实际存在的项目 `index.md`、侧边栏配置中的有效文章或递归发现的首篇文档；不会按项目目录名猜测文章地址。

已有项目中新增文章时，只需添加 `.md` 文件；无需更新 `sidebar`，新文章会自动追加到侧边栏。

存在 `project.json` 并有可用入口的项目会出现在展示列表中；没有配置入口且没有正文的空项目不生成卡片。暂时不想展示的构思或空白页，可以先留在本地记录，等有可展示的内容再添加 `project.json`。项目配置的更多字段可参考已有项目。

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
