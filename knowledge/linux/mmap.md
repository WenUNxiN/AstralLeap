---
title: mmap 内存映射
description: Linux mmap 内存映射原理、用法与注意事项
date: 2026-09-14
category:
  - Linux
tags:
  - Linux
  - mmap
  - 系统编程
platform:
  - 通用
status: learning
difficulty: intermediate
---

# mmap 内存映射

mmap 是 Linux 中一种内存映射技术，可以将文件或设备直接映射到用户空间的内存地址，实现零拷贝访问。

---

## 什么是 mmap

mmap（memory map）将一个文件或设备的内容映射到调用进程的虚拟地址空间。映射后，进程可以直接通过指针读写这块内存，内核会自动将修改同步回文件。

```
普通 read/write:
  磁盘 → 内核页缓存 → 用户缓冲区  (2次数据拷贝)

mmap:
  磁盘 → 内核页缓存 → 用户空间直接访问  (0次数据拷贝)
```

---

## 函数原型

```c
#include <sys/mman.h>

void *mmap(void *addr, size_t length, int prot, int flags,
           int fd, off_t offset);

int munmap(void *addr, size_t length);
```

### 参数说明

| 参数 | 说明 |
|---|---|
| `addr` | 期望的映射起始地址，传 NULL 由内核选择 |
| `length` | 映射的长度（字节） |
| `prot` | 保护方式：PROT_READ / PROT_WRITE / PROT_EXEC / PROT_NONE |
| `flags` | 映射类型：MAP_SHARED / MAP_PRIVATE / MAP_ANONYMOUS 等 |
| `fd` | 文件描述符 |
| `offset` | 文件偏移量，**必须是页大小的整数倍** |

### 返回值

- 成功：返回映射区域的起始地址指针
- 失败：返回 `MAP_FAILED`（即 `(void *)-1`），并设置 errno

---

## 常见用法

### 1. 文件读取（零拷贝）

```c title="mmap_read.c"
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/stat.h>

int main() {
    int fd = open("test.bin", O_RDONLY);
    struct stat st;
    fstat(fd, &st);

    // 映射整个文件
    char *data = mmap(NULL, st.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
    if (data == MAP_FAILED) {
        perror("mmap");
        return 1;
    }

    // 直接通过指针访问文件内容
    for (off_t i = 0; i < st.st_size; i++) {
        char c = data[i];
        // ...
    }

    munmap(data, st.st_size);
    close(fd);
    return 0;
}
```

### 2. 进程间共享内存

```c
// 进程 A：创建共享文件并映射
int fd = open("shared.bin", O_RDWR | O_CREAT, 0644);
ftruncate(fd, 4096); // 设置文件大小
int *shared = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
*shared = 42; // 写入共享内存

// 进程 B：打开同一文件映射
int fd = open("shared.bin", O_RDWR);
int *shared = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
printf("%d\n", *shared); // 读取到 42
```

### 3. 匿名映射（不关联文件，分配内存）

```c
// 相当于 malloc，但直接通过内核分配
void *ptr = mmap(NULL, size, PROT_READ | PROT_WRITE,
                 MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
```

---

## MAP_SHARED vs MAP_PRIVATE

| 标志 | 说明 |
|---|---|
| `MAP_SHARED` | 共享映射，修改会写回文件，其他映射同一文件的进程可见 |
| `MAP_PRIVATE` | 私有映射，写时复制（COW），修改不影响原文件，其他进程不可见 |

---

## 重要注意事项

### 1. offset 必须页对齐

mmap 的 `offset` 参数必须是系统页大小（通常 4096 字节）的整数倍。

```c
// 获取页大小
long page_size = sysconf(_SC_PAGESIZE); // 通常是 4096
```

### 2. 缺页中断

mmap 只是建立了地址映射，并没有真正读取文件内容。**第一次访问时才会触发缺页中断**，由内核将对应页从磁盘读入内存。

### 3. 修改不会立即写回

MAP_SHARED 的修改不会立即写回磁盘，需要调用 `msync()` 手动同步：

```c
msync(addr, length, MS_SYNC); // 同步等待写回完成
// 或
msync(addr, length, MS_ASYNC); // 异步写回，不等待
```

### 4. SIGBUS 信号

如果映射后文件被截断（长度变小），访问超出文件长度的部分会触发 `SIGBUS` 信号。

### 5. munmap 后不要访问

调用 `munmap()` 后再访问映射区域会触发 `SIGSEGV` 段错误。

---

## 性能对比

| 操作 | read/write | mmap |
|---|---|---|
| 小文件 (< 4KB) | 更快 | 有映射开销 |
| 大文件顺序读 | 较慢 | 快约 15~30% |
| 随机访问 | 慢很多 | 快很多 |
| 进程间共享 | 需要拷贝 | 零拷贝共享 |

---

## 常见应用场景

1. **大文件处理** — 避免读入整个文件到内存
2. **进程间通信** — 共享内存（最高效的 IPC 方式之一）
3. **V4L2 视频采集** — MMAP 模式零拷贝获取帧数据
4. **动态库加载** — 动态链接器使用 mmap 加载 .so 文件
5. **内存分配** — malloc 的底层实现之一（大块分配时）

---

## 相关实验

- [#019 Linux mmap 内存映射实验](/experiments/019-linux-mmap)
- [#022 V4L2 MMAP 视频采集实验](/experiments/022-v4l2-mmap)

---

## 相关知识

- Linux 内存管理
- 文件 IO
- 页缓存 (Page Cache)
