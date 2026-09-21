---
title: Linux 常用命令
description: Linux 日常开发常用命令速查
---

# 🐧 Linux 常用命令

## 文件与目录

```bash title="目录操作"
pwd                     # 显示当前路径
cd /path/to/dir         # 切换目录
cd ..                   # 返回上级
cd -                    # 返回上次目录
ls                      # 列出文件
ls -la                  # 列出所有文件（含隐藏）详细信息
ls -lh                  # 人性化显示大小
mkdir dir_name          # 创建目录
mkdir -p a/b/c          # 递归创建目录
rm file                 # 删除文件
rm -r dir               # 删除目录
rm -rf dir              # 强制删除目录（谨慎！）
cp src dst              # 复制文件
cp -r src_dir dst_dir   # 复制目录
mv src dst              # 移动/重命名
```

```bash title="查找文件"
find . -name "*.txt"        # 按文件名查找
find . -type f -size +10M   # 查找大于10M的文件
find . -mtime -7            # 查找7天内修改的文件
locate filename             # 快速查找（依赖数据库）
which command               # 查找命令位置
whereis command             # 查找命令的所有位置
```

## 文件内容

```bash title="查看文件"
cat file                    # 查看整个文件
cat -n file                 # 显示行号
head -20 file               # 查看前20行
tail -20 file               # 查看后20行
tail -f file                # 实时追踪文件
less file                   # 分页查看（q 退出，/ 搜索）
```

```bash title="搜索内容"
grep "pattern" file         # 搜索匹配行
grep -r "pattern" .         # 递归搜索目录
grep -i "pattern" file      # 忽略大小写
grep -n "pattern" file      # 显示行号
grep -v "pattern" file      # 反向匹配（不包含）
grep -c "pattern" file      # 统计匹配行数
```

```bash title="文本处理"
wc -l file                  # 统计行数
wc -w file                  # 统计单词数
sort file                   # 排序
sort -u file                # 排序并去重
uniq file                   # 去重（相邻重复行）
cut -d: -f1 file            # 按分隔符取列
awk '{print $1}' file       # awk 取列
sed 's/old/new/g' file      # 替换文本
```

## 系统信息

```bash title="系统状态"
uname -a                    # 内核版本
cat /proc/cpuinfo           # CPU 信息
cat /proc/meminfo           # 内存信息
free -h                     # 内存使用
df -h                       # 磁盘使用
du -sh dir                  # 目录大小
top                         # 进程监控
htop                        # 增强版 top
uptime                      # 运行时间 + 负载
date                        # 当前时间
```

## 进程管理

```bash title="进程操作"
ps aux                      # 查看所有进程
ps aux | grep nginx         # 查找进程
kill pid                    # 终止进程
kill -9 pid                 # 强制终止
killall name                # 按名称终止
pkill name                  # 按名称终止（支持模式）
nice -n 10 command          # 以指定优先级运行
renice -5 -p pid            # 修改进程优先级
```

```bash title="后台运行"
command &                   # 后台运行
nohup command &             # 后台运行，挂起不终止
jobs                        # 查看后台任务
fg %1                       # 切回前台
bg %1                       # 后台继续运行
Ctrl + Z                    # 挂起当前进程
```

## 网络

```bash title="网络信息"
ifconfig                    # 网络接口信息
ip addr                     # 网络接口信息（新命令）
ip route                    # 路由表
ping host                   # 测试连通性
ping -c 4 host              # 发4个包后停止
traceroute host             # 路由追踪
```

```bash title="端口与连接"
netstat -tulnp              # 查看监听端口
ss -tulnp                   # 查看监听端口（更快）
lsof -i :8080               # 查看占用端口的进程
curl url                    # 发起 HTTP 请求
curl -I url                 # 只看响应头
wget url                    # 下载文件
```

## 权限与用户

```bash title="权限操作"
chmod 755 file              # 修改权限
chmod +x script.sh          # 添加执行权限
chown user:group file       # 修改所有者
chown -R user dir           # 递归修改
```

```bash title="用户操作"
whoami                      # 当前用户
su - user                   # 切换用户
sudo command                # 以 root 执行
id                          # 用户 ID 信息
```

## 压缩与打包

```bash title="tar"
tar -cvf archive.tar dir/   # 打包（不压缩）
tar -czvf archive.tar.gz dir/   # 打包 + gzip 压缩
tar -xzvf archive.tar.gz    # 解压 gzip
tar -cjvf archive.tar.bz2 dir/  # 打包 + bzip2 压缩
tar -xjvf archive.tar.bz2   # 解压 bzip2
tar -tf archive.tar         # 查看包内容
```

```bash title="其他"
zip -r archive.zip dir/     # zip 压缩
unzip archive.zip           # zip 解压
gzip file                   # gzip 压缩单个文件
gunzip file.gz              # gzip 解压
```

## 设备与驱动

```bash title="设备信息"
lsusb                       # 列出 USB 设备
lspci                       # 列出 PCI 设备
lsmod                       # 列出已加载模块
modprobe module             # 加载模块
rmmod module                # 卸载模块
dmesg                       # 内核日志
dmesg | tail -20            # 查看最后20行内核日志
```

## Shell 技巧

```bash title="管道与重定向"
cmd1 | cmd2                 # 管道：cmd1 输出作为 cmd2 输入
cmd > file                  # 标准输出重定向（覆盖）
cmd >> file                 # 标准输出重定向（追加）
cmd 2> file                 # 错误输出重定向
cmd &> file                 # 所有输出重定向
cmd < file                  # 从文件读取输入
```

```bash title="命令替换"
files=$(ls)                 # 命令结果赋值给变量
echo $(date)                # 在字符串中执行命令
```

---

> 💡 更多 Linux 系统编程知识 → [mmap 内存映射](/knowledge/linux/mmap)
