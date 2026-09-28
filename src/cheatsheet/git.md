---
title: Git 命令速查
description: Git 常用命令速查表（提交、分支、远程、撤销、变基等）
---

# 🌿 Git 命令速查

## 基础配置

```bash title="配置用户信息"
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

```bash title="配置编辑器"
git config --global core.editor vim
```

```bash title="查看配置"
git config --list
```

```bash title="别名配置"
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.lg "log --oneline --graph --all"
```

## 创建与克隆

```bash title="初始化仓库"
git init
```

```bash title="克隆仓库"
git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git my-dir
git clone -b dev https://github.com/user/repo.git  # 指定分支
```

## 暂存与提交

```bash title="查看状态"
git status
```

```bash title="添加到暂存区"
git add file.txt          # 单个文件
git add .                 # 所有文件
git add -u                # 仅更新已跟踪的文件
git add *.md              # 通配符
```

```bash title="提交"
git commit -m "message"   # 带消息提交
git commit -am "message"  # 跳过 add，直接提交已跟踪文件
git commit --amend        # 修改上一次提交
```

```bash title="从暂存区撤回"
git restore --staged file.txt
git reset HEAD file.txt   # 旧版本命令
```

## 查看历史

```bash title="查看提交历史"
git log
git log --oneline          # 一行显示
git log -5                 # 最近5条
git log --graph            # 图形化分支
git log --all              # 所有分支
git log --author="name"    # 按作者筛选
git log --since="2024-01-01"  # 按时间筛选
git log -p file.txt        # 查看文件的修改历史
```

```bash title="查看某次提交"
git show commit_id
git show commit_id:file.txt
```

```bash title="比较差异"
git diff                   # 工作区 vs 暂存区
git diff --staged          # 暂存区 vs 最后提交
git diff HEAD              # 工作区 vs 最后提交
git diff branch1 branch2   # 两个分支比较
```

## 分支操作

```bash title="查看分支"
git branch                 # 本地分支
git branch -a              # 所有分支（含远程）
git branch -r              # 远程分支
git branch -v              # 显示最后提交
```

```bash title="创建分支"
git branch dev             # 创建 dev 分支
git checkout -b dev        # 创建并切换到 dev
git switch -c dev          # 同上（新命令）
```

```bash title="切换分支"
git checkout dev
git switch dev             # 新命令
git checkout -             # 切换回上一个分支
git switch -               # 同上
```

```bash title="删除分支"
git branch -d dev          # 删除已合并的分支
git branch -D dev          # 强制删除
```

```bash title="重命名分支"
git branch -m old new
```

## 合并与变基

```bash title="合并"
git merge dev              # 将 dev 合并到当前分支
git merge --no-ff dev      # 不使用快进合并
git merge --squash dev     # 压缩成一个提交
```

```bash title="变基"
git rebase main            # 将当前分支变基到 main
git rebase -i HEAD~3       # 交互式变基（最近3个提交）
```

```bash title="变基中的操作"
git rebase --continue      # 继续变基
git rebase --abort         # 中止变基
git rebase --skip          # 跳过当前提交
```

## 远程操作

```bash title="查看远程仓库"
git remote -v
```

```bash title="添加远程仓库"
git remote add origin https://github.com/user/repo.git
```

```bash title="拉取"
git fetch origin           # 拉取远程更新，不合并
git pull origin main       # 拉取并合并
git pull --rebase origin main  # 拉取并变基
```

```bash title="推送"
git push origin main       # 推送到远程
git push -u origin main    # 推送并设置上游
git push origin dev -f     # 强制推送（谨慎！）
git push origin --delete dev  # 删除远程分支
```

## 撤销与回退

```bash title="撤销工作区修改"
git restore file.txt
git checkout -- file.txt   # 旧命令
```

```bash title="撤回暂存"
git restore --staged file.txt
git reset HEAD file.txt
```

```bash title="回退提交"
git reset --soft HEAD~1    # 回退到上一次，改动保留在暂存区
git reset --mixed HEAD~1   # 回退到上一次，改动保留在工作区（默认）
git reset --hard HEAD~1    # 回退到上一次，所有改动丢弃！
```

```bash title="撤销某次提交（生成新提交）"
git revert commit_id
```

```bash title="回到某个提交"
git checkout commit_id     # 临时查看（分离头指针）
git switch -               # 返回
```

## 贮藏（Stash）

```bash title="保存工作进度"
git stash
git stash save "message"
git stash -u               # 包含未跟踪文件
```

```bash title="查看贮藏列表"
git stash list
```

```bash title="应用贮藏"
git stash apply            # 应用最新的，保留在列表中
git stash pop              # 应用最新的，并从列表移除
git stash apply stash@{1}  # 应用指定的
```

```bash title="删除贮藏"
git stash drop stash@{0}
git stash clear            # 清空所有
```

## 标签

```bash title="创建标签"
git tag v1.0.0             # 轻量标签
git tag -a v1.0.0 -m "Release 1.0"  # 附注标签
```

```bash title="查看标签"
git tag
git tag -l "v1.*"          # 按模式过滤
git show v1.0.0
```

```bash title="推送标签"
git push origin v1.0.0     # 推送单个标签
git push origin --tags     # 推送所有标签
```

```bash title="删除标签"
git tag -d v1.0.0
git push origin --delete v1.0.0  # 删除远程标签
```

## 常见场景

```bash title="放弃所有本地修改"
git reset --hard HEAD
git clean -fd              # 删除未跟踪文件
```

```bash title="临时切换分支，当前工作未完成"
git stash
git switch other-branch
# ... 做完事情 ...
git switch original-branch
git stash pop
```

```bash title="将提交移动到另一个分支"
# 假设在错误的分支上做了提交
git log                    # 记下 commit_id
git reset --hard HEAD~1    # 回退（如果还没 push）
git switch correct-branch
git cherry-pick commit_id  # 把提交移过来
```

```bash title="修改最近一次提交的 message"
git commit --amend -m "new message"
# 如果已经 push 了，需要强制推送
git push -f
```

```bash title="撤销已 push 的提交"
git revert commit_id       # 生成一个反向提交
git push origin main       # 推送上去
# （不建议 reset + force push 到公共分支）
```

---

> 💡 更多开发工具速查 → [Linux 常用命令](linux) · [V4L2 命令](v4l2)
