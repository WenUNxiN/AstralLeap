---
title: 设备树基础
description: Linux 设备树（Device Tree）原理、语法与常见节点
date: 2026-09-17
category:
  - Driver
tags:
  - Device Tree
  - 驱动
  - Linux
platform:
  - 通用
status: learning
difficulty: beginner
---

# 设备树基础

设备树（Device Tree，简称 DT）是一种描述硬件配置的数据结构，用于将硬件信息从内核驱动中分离出来，让同一份内核代码可以适配不同的硬件板卡。

---

## 为什么需要设备树

在设备树出现之前，Linux 内核里硬编码了大量板级信息（寄存器地址、GPIO 分配、中断号等）。每出一块新板子就要改内核代码，导致内核里充斥着各种板级文件。

设备树的核心思想：**把硬件描述从内核代码中剥离出来，用一个独立的数据结构描述硬件，内核启动时读取这个结构来识别和初始化硬件。**

```
传统方式:  内核源码 + board-file.c（硬编码） → 编译出针对特定板子的内核
设备树:    内核源码 + xxx.dts（文本描述） → 内核 + dtb（二进制） → 通用内核适配多板子
```

---

## 设备树文件类型

| 类型 | 扩展名 | 说明 |
|---|---|---|
| DTS | `.dts` | 设备树源文件，人类可读，描述具体板级硬件 |
| DTSI | `.dtsi` | 设备树包含文件，描述通用 SoC 配置，可被 dts 引用 |
| DTB | `.dtb` | 设备树二进制文件，DTS 编译后的产物，内核启动时加载 |
| DTC | — | 设备树编译器，将 DTS 编译为 DTB |

### 编译与反编译

```bash title="编译 DTS → DTB"
dtc -I dts -O dtb -o board.dtb board.dts
```

```bash title="反编译 DTB → DTS"
dtc -I dtb -O dts -o board.dts board.dtb
```

```bash title="内核中编译"
make dtbs    # 编译所有设备树
```

---

## 基本语法

### 节点结构

设备树是一个树状结构，每个节点用 `node-name@unit-address` 表示：

```dts
/ {
    node1 {
        property1 = <value>;
        property2 = "string";

        child-node@0 {
            compatible = "vendor,device";
            reg = <0x0 0x100>;
        };
    };
};
```

### 节点命名规则

- 格式：`node-name@unit-address`
- `node-name`：用小写字母、数字、`-`，描述设备类型
- `unit-address`：设备地址（通常是寄存器基地址），同类型设备用它区分
- 根节点：`/`

### 常见属性

| 属性 | 说明 | 示例 |
|---|---|---|
| `compatible` | 兼容性字符串，用于匹配驱动 | `"rockchip,rk3566-i2c"` |
| `reg` | 寄存器地址范围 | `<0xff650000 0x1000>` |
| `status` | 设备状态 | `"okay"` / `"disabled"` |
| `interrupts` | 中断号 | `<GIC_SPI 12 IRQ_TYPE_LEVEL_HIGH>` |
| `clocks` | 时钟 | `<&cru CLK_I2C1>` |
| `pinctrl` | 引脚复用 | `<&i2c1m0_xfer>` |
| `#address-cells` | 子节点 reg 中地址所占的 cell 数 | `<2>` |
| `#size-cells` | 子节点 reg 中大小所占的 cell 数 | `<2>` |

---

## 常用节点示例

### I2C 节点

```dts
&i2c1 {
    status = "okay";
    clock-frequency = <400000>;

    sensor@1a {
        compatible = "sony,imx477";
        reg = <0x1a>;
        pinctrl-names = "default";
        pinctrl-0 = <&sensor_pins>;

        reset-gpios = <&gpio0 RK_PA0 GPIO_ACTIVE_LOW>;
        pwdn-gpios = <&gpio0 RK_PA1 GPIO_ACTIVE_HIGH>;
    };
};
```

### UART 节点

```dts
&uart2 {
    status = "okay";
    pinctrl-names = "default";
    pinctrl-0 = <&uart2m0_xfer>;
};
```

### GPIO 按键

```dts
gpio_keys {
    compatible = "gpio-keys";
    pinctrl-names = "default";

    key_power {
        label = "power";
        gpios = <&gpio0 RK_PC0 GPIO_ACTIVE_LOW>;
        linux,code = <KEY_POWER>;
        debounce-interval = <100>;
    };
};
```

---

## label 与 & 引用

在 dtsi 中定义节点（带 label），在 dts 中用 `&label` 引用并追加或修改属性：

```dts title="rk3566.dtsi（SoC 通用定义）"
i2c1: i2c@ff650000 {
    compatible = "rockchip,rk3566-i2c";
    reg = <0x0 0xff650000 0x0 0x1000>;
    interrupts = <GIC_SPI 12 IRQ_TYPE_LEVEL_HIGH>;
    clocks = <&cru CLK_I2C1>;
    status = "disabled";  // 默认禁用
};
```

```dts title="board.dts（板级修改）"
&i2c1 {
    status = "okay";     // 启用
    clock-frequency = <400000>;
    // 添加子设备...
};
```

---

## 状态属性值

| 值 | 说明 |
|---|---|
| `okay` | 设备正常可用 |
| `disabled` | 设备禁用 |
| `fail` | 设备检测失败 |
| `fail-sss` | 检测失败，sss 是错误原因 |

---

## 设备树与驱动匹配

驱动通过 `compatible` 属性匹配设备树节点：

```c title="驱动侧"
static const struct of_device_id my_of_match[] = {
    { .compatible = "vendor,my-device" },
    { }
};
MODULE_DEVICE_TABLE(of, my_of_match);
```

```dts title="设备树侧"
my-device@10000000 {
    compatible = "vendor,my-device";
    reg = <0x10000000 0x1000>;
    status = "okay";
};
```

两者的 `compatible` 字符串一致时，驱动的 `probe` 函数就会被调用。

---

## 运行时查看设备树

```bash title="查看设备树节点"
ls /sys/firmware/devicetree/base/

# 查看某个属性
cat /sys/firmware/devicetree/base/i2c@ff650000/status
```

```bash title="查看设备树解析后的平台设备"
ls /sys/bus/platform/devices/
```

---

## 调试技巧

1. **检查节点是否存在**：`/sys/firmware/devicetree/base/` 下有没有对应节点
2. **检查 status**：确认节点 status 是 okay
3. **检查驱动 probe**：`dmesg | grep driver-name` 看 probe 是否成功
4. **检查 compatible**：确保设备树和驱动的 compatible 完全一致
5. **反编译 dtb 验证**：`dtc -I dtb -O dts /boot/board.dtb` 看实际编译结果

---

## 常见坑

1. **地址漏了 `0x` 前缀**：不加 0x 会被当成十进制
2. **reg 长度不匹配**：`#address-cells` 和 `#size-cells` 决定了 reg 有几个数
3. **GPIO 极性搞反**：`GPIO_ACTIVE_HIGH` vs `GPIO_ACTIVE_LOW`
4. **pinctrl 没配**：外设引脚没配置成对应功能，外设无法工作
5. **status 忘改 okay**：dtsi 里默认 disabled，dts 里忘记启用

---

## 相关知识

- [I2C 驱动](i2c)
- GPIO 子系统
- Linux 驱动模型

## 相关实验

- [#021 Camera Sensor I2C 通信验证](/experiments/021-camera-i2c)

## 相关 Debug

- [VIDIOC_DQBUF Timeout](/debug/v4l2-dqbuf-timeout) — 设备树 remote-endpoint 配置错误
