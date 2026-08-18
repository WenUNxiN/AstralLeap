---
title: Linux驱动开发笔记一：内核模块
category: 嵌入式软件
date: 2026-08-15
author: Stellan W
tags:
  - Linux
  - buildroot

---

# 第一章：内核模块

## 1.1 模块驱动基础

内核模块是 Linux 内核中可以在运行时动态加载和卸载的代码，是 Linux 驱动开发的基础。

### 三要素（面试常考）

| 要素         | 说明                                     |
| ------------ | ---------------------------------------- |
| **入口函数** | 向内核申请资源，`insmod` 加载时调用      |
| **出口函数** | 释放向内核申请的资源，`rmmod` 卸载时调用 |
| **许可证**   | 遵循 GPL 开源协议，必须声明              |

### 代码示例

```c
#include <linux/init.h>
#include <linux/module.h>

// 入口函数：向内核申请资源
static int __init demo_init(void)
{
    // __init 修饰函数，将其放到 .init.text 段中
    // 定义在 init.h 中：#define __init __section(.init.text)
    // section 属性告诉编译器将被修饰的变量/函数放到特定段中
    return 0;
}

// 出口函数：释放向内核申请的资源
static void __exit demo_exit(void)
{
}

// 修饰入口/出口函数
module_init(demo_init);
module_exit(demo_exit);


MODULE_LICENSE("GPL");  // 许可证声明
MODULE_AUTHOR("xxxx");  // 作者消息
MODULE_VERSION("1.0");  // 版本号
```

### 编译方式 — 外部编译（Out-of-tree）

借助内核源码中的 Makefile 进行交叉编译：

```makefile
# 获取makefile文件所在目录
PWD ?= $(shell pwd)
# 内核源码目录(根据实际路径修改)
KERNELDIR:=/home/wen/Desktop/linux_kernel6.1_sdk/kernel-6.1
# 交叉编译工具链(根据实际路径修改)
CROSS_COMPILE:=/home/wen/Desktop/linux_kernel6.1_sdk/prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.3-2021.07-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-

# 把 demo_mod.o作为模块进行编译，-m 表示编译为模块
obj-m += demo_mod.o

# 编译模块
module:
	make -C $(KERNELDIR) M=$(PWD) ARCH=arm64 CROSS_COMPILE=$(CROSS_COMPILE) modules
	# -C $(KERNELDIR)  切换到内核源码目录，借助其 Makefile 进行 make
	# M=$(PWD)         只编译当前目录下的驱动文件
	# ARCH=arm64       指定编译架构
	# CROSS_COMPILE=$(CROSS_COMPILE)  指定交叉编译工具链

# 清理编译生成的文件
clean:
	make -C $(KERNELDIR) M=$(PWD) ARCH=arm64 CROSS_COMPILE=$(CROSS_COMPILE) clean
```

⚠️ 注意 CROSS_COMPILE 末尾的短横线 - 不能丢，内核构建系统会自动拼上 gcc

### 编译方式 — 内部编译（In-tree）

**特点**：将驱动代码直接放入内核源码树中，随内核一起编译。

**适用场景**：驱动正式合入内核、需要依赖内核内部头文件、驱动随内核统一发布。

**操作步骤**：

#### 1. 放置源码

在内核源码树的 `drivers/char/` 下新建 `demo_mod/` 子目录，将驱动源码放入其中：

```bash
mkdir -p /path/to/your/sdk/kernel/drivers/char/demo_mod
cp demo_mod.c /path/to/your/sdk/kernel/drivers/char/demo_mod/
```

#### 2. 修改该目录下的 `Kconfig`

在驱动所在目录的 `Kconfig` 文件中添加配置项，选项最终会变成 `.config` 文件中的变量（如 `CONFIG_DEMO_MOD`），决定哪些代码被编译。

```kconfig
config DEMO_MOD
    bool "Demo module support"
    default y
    depends on ARCH_ROCKCHIP
    help
      This is a demo kernel module for learning purpose.
```

Kconfig 常用语法：

| 关键字                       | 说明                                                             |
| :--------------------------- | :--------------------------------------------------------------- |
| **`config`**                 | 定义配置项，后跟选项名（如`DEMO_MOD`，会生成 `CONFIG_DEMO_MOD`） |
| **`tristate`**               | 三态选项，可选`<*>` (Y 内建)、`<M>` (M 模块)、`< >` (N 不编译)   |
| **`bool`**                   | 布尔选项，只能选`<*>` (Y) 或 `< >` (N)，常用于核心代码           |
| **`default`**                | 默认值（可填`y` / `m` / `n`）                                    |
| **`depends on`**             | 依赖条件，条件不满足时选项不显示（灰色不可选）                   |
| **`select`**                 | 反向依赖，选中本项时会自动将另一项设为`y`                        |
| **`help`**                   | 帮助信息，在 menuconfig 中按`?` 或 `H` 显示                      |
| **`menu` ... `endmenu`**     | 定义子菜单，将多个选项分组显示                                   |
| **`choice` ... `endchoice`** | 定义单选/多选组，用于互斥选项                                    |

#### 3. 修改该目录下的 `Makefile`

在驱动所在目录的 `Makefile` 中添加：

```makefile
obj-$(CONFIG_DEMO_MOD) += demo_mod.o
```

`CONFIG_DEMO_MOD` 的值（来自 `.config`）决定最终编译行为：

| 值               | 编译行为                                  |
| :--------------- | :---------------------------------------- |
| `=y`             | 编译进内核（`demo_mod.o` 并入 `vmlinux`） |
| `=m`             | 编译为独立的`.ko` 模块                    |
| `=n`（或未定义） | 忽略，不编译                              |

#### 4. 接入父级构建系统（递归包含）

> **核心原理**：内核的 `Kconfig` 和 `Makefile` 都是**树状递归**结构。顶层文件必须通过 `source`（Kconfig）或 `obj-y/obj-m`（Makefile）显式包含下一级目录，否则构建系统无法找到你的驱动。

**① 父级 Kconfig 的 `source`**

修改 `drivers/char/Kconfig`，添加包含语句（让 `menuconfig` 能加载你的选项）：

```kconfig
source "drivers/char/demo_mod/Kconfig"
```

**② 父级 Makefile 的 `obj-y`**

修改 `drivers/char/Makefile`，添加目录包含语句（让 `make` 能递归进入该目录）：

```makefile
obj-y += demo_mod/
```

- `obj-y += demo_mod/`：无论 `.config` 怎么选，都会进入 `demo_mod/` 目录（具体是否编译由该目录下 Makefile 配合 `CONFIG_*` 决定）
- `obj-m += demo_mod/`：仅在该目录下有模块被选为 `M` 时才进入

**层级结构示例**（以 `drivers/char/demo_mod/` 为例）：

```text
顶层 Kconfig
└── source "drivers/Kconfig"
    └── drivers/Kconfig
        ├── source "drivers/char/Kconfig"
        │   └── drivers/char/Kconfig
        │       └── source "drivers/char/demo_mod/Kconfig"
        │           └── drivers/char/demo_mod/Kconfig
        │               └── config DEMO_MOD   ← 你的选项
        ├── source "drivers/net/Kconfig"
        └── source "drivers/usb/Kconfig"
```

**编译流程图解**（运行 `make` 时发生了什么）：

```text
make (顶层)
  └── 读取 .config
      └── 进入 drivers/       ← 由顶层 Makefile 的 obj-y += drivers/ 决定
          └── 进入 char/      ← 由 drivers/Makefile 的 obj-y += char/ 决定
              └── 进入 demo_mod/  ← 由 drivers/char/Makefile 的 obj-y += demo_mod/ 决定
                  └── 执行 demo_mod/Makefile
                      └── 根据 CONFIG_DEMO_MOD 的值：
                          ├── = y  → 编译进内核
                          ├── = m  → 生成 demo_mod.ko
                          └── = n  → 不编译
```

**修改检查清单**（驱动放在 `drivers/char/demo_mod/`，文件名 `demo_mod.c`）：

| 序号 | 文件路径                         | 需要做的修改                                 | 是否必须 |
| :--- | :------------------------------- | :------------------------------------------- | :------- |
| 1    | `drivers/char/demo_mod/Kconfig`  | 添加`config DEMO_MOD ...` 块                 | 必须     |
| 2    | `drivers/char/Kconfig`           | 添加`source "drivers/char/demo_mod/Kconfig"` | 必须     |
| 3    | `drivers/char/demo_mod/Makefile` | 添加`obj-$(CONFIG_DEMO_MOD) += demo_mod.o`   | 必须     |
| 4    | `drivers/char/Makefile`          | 添加`obj-y += demo_mod/`                     | 必须     |

> 📌 **总结**：要让 `menuconfig` 显示选项并最终编译你的驱动，必须确保从根 `Kconfig` / `Makefile` 到你的目录，每一级父级文件中都有对应的 `source` / `obj-y` 声明。SDK 中常用目录通常已配置好，只需确认即可。

##### 5. 配置内核

**推荐方式：使用 SDK 构建脚本**

```bash
# 进入 SDK 根目录
cd /path/to/your/sdk

# 选择板级配置（泰山派 RK3566）
./build.sh lunch
# 在列表中选择 rk3566-tspi 对应的选项

# 打开内核配置菜单
./build.sh kernel_menuconfig

# 进入 Device Drivers -> Misc devices
# 找到 Demo module support，按空格选中为 <M>（模块）或 <*>（内建）
# 保存并退出
```

> ⚠️ **注意：配置只临时保存到 `.config`**
> `./build.sh kernel_menuconfig` 本质上调用 `make menuconfig`，保存退出后配置写入 `kernel/.config`，随后的 `./build.sh kernel` 会读取它进行编译（**本次编译生效**）。
> 但 `.config` 是临时文件，**重新执行 `./build.sh lunch` 或 `make rockchip_linux_defconfig` 会覆盖它**。要让配置永久生效（每次 lunch 都默认开启），需走下面的"手动方式"，执行 `make savedefconfig` 回写到 `rockchip_linux_defconfig`。

**手动方式（进阶，仅当熟悉流程时使用）**

```bash
# 进入内核目录
cd /path/to/your/sdk/kernel

# 加载泰山派基础配置
make ARCH=arm64 rockchip_linux_defconfig

# 修改配置
make ARCH=arm64 menuconfig

# 保存配置供后续使用（重要！）
make ARCH=arm64 savedefconfig
# 备份原始配置
cp arch/arm64/configs/rockchip_linux_defconfig arch/arm64/configs/rockchip_linux_defconfig.bak
# 覆盖默认配置
mv defconfig arch/arm64/configs/rockchip_linux_defconfig
```

> 📌 **理解 `.config` 的作用**：内核编译依赖于当前目录下的 `.config` 文件。`menuconfig` 会读取并修改这个文件。SDK 默认使用的配置文件是 `kernel/arch/arm64/configs/rockchip_linux_defconfig`，通过 `make rockchip_linux_defconfig` 可以生成 `.config`。

#### 6. 编译内核与模块

**推荐方式：使用 SDK 构建脚本**

```bash
# 在 SDK 根目录执行
./build.sh kernel
```

#### 7. 清理

**SDK 方式**：

```bash
./build.sh clean
```

### 两种编译方式对比

| 对比项             | 外部编译（Out-of-tree）                 | 内部编译（In-tree）               |
| :----------------- | :-------------------------------------- | :-------------------------------- |
| **源码位置**       | 独立目录，任意位置                      | 放入内核源码树内                  |
| **修改内核文件**   | 无需修改                                | 需修改`Kconfig`、`Makefile`       |
| **配置菜单**       | 无，直接编译                            | 可通过`menuconfig` 控制           |
| **编译命令**       | `make -C $(KERNELDIR) M=$(PWD) modules` | 使用`./build.sh kernel` 或 `make` |
| **依赖内核头文件** | 依赖已导出的头文件                      | 可访问所有内部头文件              |
| **编译速度**       | 较快（只编译当前目录）                  | 较慢（可能重编整个内核）          |
| **适用场景**       | 开发测试阶段                            | 正式集成、提交主线                |

### 模块加载/卸载与常用命令

两种编译方式最终都会生成 `.ko` 模块（或内建进内核镜像），加载、卸载及排查时使用以下命令（如果已经是root权限，无需sudo）。

**加载模块**

```bash
  sudo insmod xxx.ko
```

**卸载模块**

```bash
  sudo rmmod xxx
```

**查看已加载模块**

```bash
  lsmod

  lsmod | grep xxx
```

**查看内核日志（看printk输出）**

```bash
  dmesg | tail
```

  dmesg 命令用于查看内核日志，`| tail` 表示只显示最后 10 行日志

**查看模块参数描述**
Buildroot 系统默认不带 modinfo 命令，需要手动安装。

```bash
  sudo modinfo xxx
```

---

## 1.2 printk 日志打印

`printk` 是内核中用于输出调试信息的函数，类似于用户空间的 `printf`，但运行在内核态。

### 消息等级（共 8 种，0-7，数值越小优先级越高）

| 等级 | 宏定义         | 说明           |
| ---- | -------------- | -------------- |
| 0    | `KERN_EMERG`   | 紧急，系统崩溃 |
| 1    | `KERN_ALERT`   | 必须立即处理   |
| 2    | `KERN_CRIT`    | 严重错误       |
| 3    | `KERN_ERR`     | 错误           |
| 4    | `KERN_WARNING` | 警告           |
| 5    | `KERN_NOTICE`  | 正常但重要     |
| 6    | `KERN_INFO`    | 信息           |
| 7    | `KERN_DEBUG`   | 调试           |

### 终端消息级别关系

使用printk输出日志时，会根据消息等级判断是否输出，如果消息等级低于终端消息级别，则不输出。
查看终端消息级别关系：

```bash
cat /proc/sys/kernel/printk
```

```
      4               4              1               7
终端的消息级别  消息的默认级别  终端最大消息级别  终端最小消息级别
```

### 代码示例

```c
static int __init demo_init(void)
{
    // 方式一：显式指定消息等级
    printk(KERN_ERR "hello world %s\n", "init");
    // 方式二：不指定等级，使用默认等级（4）
    printk("hello world %s\n", "init");
    return 0;
}

static void __exit demo_exit(void)
{
    printk("hello world %s\n", "exit");
}
```
## 1.4 模块参数

模块参数允许在加载驱动时向内核传递参数，增强驱动的灵活性。

### 相关 API

#### `module_param` — 单个参数

```c
module_param(name, type, perm);
```

| 参数   | 说明                                             |
| ------ | ------------------------------------------------ |
| `name` | 变量名，内核以此名创建文件                       |
| `type` | 变量类型（byte 类型传输 char 时以 ASCII 码传递） |
| `perm` | 文件权限，最大 0664                              |

#### `module_param_array` — 数组参数

```c
module_param_array(name, type, nump, perm);
```

| 参数   | 说明                         |
| ------ | ---------------------------- |
| `name` | 变量名                       |
| `type` | 类型                         |
| `nump` | 接收数组的长度（需传递指针） |
| `perm` | 权限                         |

#### `module_param_string` — 字符串参数

```c
module_param_string(name, string, len, perm);
```

| 参数     | 说明                                 |
| -------- | ------------------------------------ |
| `name`   | 对外暴露的参数名（用户空间所见）     |
| `string` | 实际存放字符串的缓冲区               |
| `len`    | 缓冲区大小（通常用`sizeof(string)`） |
| `perm`   | 文件权限，最大 0664                  |

> **与 `charp` 类型的区别**：`charp` 是字符指针，内核会动态分配内存并存储指针；`module_param_string` 直接将字符串拷贝到预先定义的静态字符数组中，不会动态分配内存。

#### `MODULE_PARM_DESC` — 参数描述

```c
MODULE_PARM_DESC(_parm, desc);
```

### 支持的类型

```
byte, short, ushort, int, uint, long, ulong
charp（字符指针）, bool（0/1, y/n, Y/N）, invbool（反向 bool）
```

### 代码示例

```c
int led_level = 0;
module_param(led_level, int, 0664);
MODULE_PARM_DESC(led_level, "type is int, level=0-1024");

int len = 0;
int arr[10] = {0};
module_param_array(arr, int, &len, 0664);
MODULE_PARM_DESC(arr, "type is arraylist");

char c = 'A';
module_param(c, byte, 0664);
MODULE_PARM_DESC(c, "type is byte");

char str[32] = {0};
module_param_string(str, str, sizeof(str), 0664);
MODULE_PARM_DESC(str, "type is string");

static int __init demo_init(void)
{
    int i = 0;
    printk("led_level = %d\n", led_level);
    for (i = 0; i < len; i++) {
        printk("arr[%d] = %d \n", i, arr[i]);
    }
    printk("c = %c\n", c);
    printk("str = %s\n", str);
    return 0;
}
```

### 传参方式

```bash
# 方式一：通过 sysfs 节点
echo 999 > /sys/module/demo/parameters/led_level

# 方式二：加载时直接传参
sudo insmod demo.ko led_level=255 arr=11,22,33,44,55 str="hello泰山派"
```

> **注意**：C89/C90 标准不支持在 for 循环内声明变量（如 `for(int i=0; ...)`），内核模块通常使用 C89/C90，需在函数开头声明。
---

## 1.3 内核符号导出与模块依赖

在 Linux 内核中，默认符号仅对内核可见。当模块 B 需要调用模块 A 的符号时，必须在模块 A 中使用 `EXPORT_SYMBOL` 显式导出符号。

### 核心 API

| 宏定义                    | 说明                                                       |
| ------------------------- | ---------------------------------------------------------- |
| `EXPORT_SYMBOL(符号)`     | 导出符号给所有模块使用（不限许可证）                       |
| `EXPORT_SYMBOL_GPL(符号)` | 仅导出给**GPL 兼容** 许可证的模块使用，非 GPL 模块无法引用 |

> **注意**：若使用 `EXPORT_SYMBOL_GPL`，模块 B 必须声明 `MODULE_LICENSE("GPL")`，否则加载时会报 `Unknown symbol`。

### `Module.symvers` 与符号传递机制

- 编译模块时自动生成，包含导出的符号及其 **CRC 校验值**（用于版本匹配）。
- **跨模块依赖时**，构建系统必须获知被依赖模块的符号表。
  **标准做法**：在模块 B 的 Makefile 中通过 **`KBUILD_EXTRA_SYMBOLS`** 变量指定模块 A 的 `Module.symvers` 路径，推荐方式。

### 代码示例

**module_a.c（导出方）**

```c
#include <linux/module.h>
#include <linux/init.h>

/* 定义并导出符号 */
int my_num = 100;
EXPORT_SYMBOL(my_num);

void my_show(void)
{
    printk(KERN_INFO "module_a: my_show called\n");
}
EXPORT_SYMBOL(my_show);   // 也可改用 EXPORT_SYMBOL_GPL

static int __init module_a_init(void)
{
    printk(KERN_INFO "module_a: init, my_num = %d\n", my_num);
    return 0;
}
static void __exit module_a_exit(void)
{
    printk(KERN_INFO "module_a: exit\n");
}

module_init(module_a_init);
module_exit(module_a_exit);
MODULE_LICENSE("GPL");
MODULE_AUTHOR("wen");
```

**module_b.c（导入方）**

```c
#include <linux/module.h>
#include <linux/init.h>

/* 声明外部符号（类型必须与导出完全一致） */
extern int my_num;
extern void my_show(void);

static int __init module_b_init(void)
{
    printk(KERN_INFO "module_b: read my_num = %d\n", my_num);
    my_show();
    return 0;
}
static void __exit module_b_exit(void)
{
    printk(KERN_INFO "module_b: exit\n");
}

module_init(module_b_init);
module_exit(module_b_exit);
MODULE_LICENSE("GPL");
MODULE_AUTHOR("wen");
```

**Makefile（导入方 B，推荐写法）**

```makefile
PWD ?= $(shell pwd)
KERNELDIR := /home/wen/Desktop/linux_kernel6.1_sdk/kernel-6.1
CROSS_COMPILE := /home/wen/Desktop/linux_kernel6.1_sdk/prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.3-2021.07-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-

# 通过 KBUILD_EXTRA_SYMBOLS 指定模块 A 的符号表路径（唯一推荐方式）
EXTRA_SYMBOLS := $(PWD)/../module_a/Module.symvers
export KBUILD_EXTRA_SYMBOLS := $(EXTRA_SYMBOLS)

obj-m += module_b.o

module:
	make -C $(KERNELDIR) M=$(PWD) ARCH=arm64 CROSS_COMPILE=$(CROSS_COMPILE) modules

clean:
	make -C $(KERNELDIR) M=$(PWD) ARCH=arm64 CROSS_COMPILE=$(CROSS_COMPILE) clean
```

> **关键点**：`export KBUILD_EXTRA_SYMBOLS` 将变量导出为环境变量，确保 `modpost` 阶段能够正确读取，无需手动复制文件。

### 编译构建（严格顺序）

```bash
# 1. 编译模块 A（生成 Module.symvers）
cd /path/module_a && make

# 2. 编译模块 B（KBUILD_EXTRA_SYMBOLS 自动指引符号表位置）
cd /path/module_b && make
```

> ⚠️ **常见错误**：若未正确设置 `KBUILD_EXTRA_SYMBOLS`，编译 B 时会报错：
> `ERROR: modpost: "my_num" [/path/module_b/module_b.ko] undefined!`

### 加载与卸载规则

| 操作     | 正确顺序  | 错误后果                |
| -------- | --------- | ----------------------- |
| **加载** | 先 A 后 B | `Unknown symbol` 错误   |
| **卸载** | 先 B 后 A | `Module is in use` 错误 |

```bash
# 正确操作
sudo insmod module_a.ko && sudo insmod module_b.ko   # 加载
sudo rmmod module_b && sudo rmmod module_a           # 卸载
```

### 验证命令

```bash
# 查看加载日志
dmesg | tail -5

# 查看模块依赖关系
lsmod | grep -E "module_a|module_b"
# 输出示例：module_a  Used by: module_b   （表示依赖建立成功）
```

### 常见问题排查

| 现象                      | 可能原因及解决                                                           |
| ------------------------- | ------------------------------------------------------------------------ |
| 编译 B 时`undefined`      | 未设置`KBUILD_EXTRA_SYMBOLS` 或路径错误 → 检查 Makefile 中的路径是否正确 |
| 加载 B 时`Unknown symbol` | 未先加载 A → 按顺序加载；或 A 使用了`EXPORT_SYMBOL_GPL` 而 B 未声明 GPL  |
| 卸载 A 时`in use`         | 未先卸载 B → 按顺序卸载                                                  |
| 加载后`dmesg` 无输出      | 检查`printk` 日志级别，或使用 `pr_info` 替代 `printk`                 |

### 关键口诀 ⭐

| 操作 | 顺序      | 记忆点                                                |
| ---- | --------- | ----------------------------------------------------- |
| 编译 | 先 A 后 B | 通过`KBUILD_EXTRA_SYMBOLS` 指定符号表路径（推荐方式） |
| 加载 | 先 A 后 B | 父子顺序                                              |
| 卸载 | 先 B 后 A | 反向顺序                                              |

---