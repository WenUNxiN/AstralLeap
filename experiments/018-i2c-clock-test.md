---
title: I2C 时钟频率测试
description: 测试不同 I2C 时钟频率下 Sensor 的通信稳定性
date: 2026-09-12
category:
  - Driver
  - I2C
tags:
  - I2C
  - 驱动
  - 时钟
platform:
  - RV1126B
status: verified
difficulty: beginner
---

# #018 · I2C 时钟频率测试

## 实验目标

在 RV1126B 上测试 Sensor 在不同 I2C 时钟频率（100KHz / 400KHz / 1MHz）下的通信稳定性，找出最高可用频率。

---

## 实验环境

| 项目 | 内容 |
|---|---|
| 开发板 | RV1126B |
| 内核版本 | 5.10.x |
| Sensor | IMX477 |
| I2C 地址 | 0x1a |
| I2C 总线 | I2C1 |

---

## 实验步骤

### Step 1：修改设备树时钟频率

```dts title="设备树修改"
&i2c1 {
    status = "okay";
    clock-frequency = <100000>; // 先从 100KHz 开始
    // clock-frequency = <400000>;
    // clock-frequency = <1000000>;
};
```

### Step 2：编译并烧录设备树

```bash title="shell"
# 编译内核设备树
make dtbs

# 烧录到开发板
# （根据实际平台方式烧录）
```

### Step 3：读写测试

```bash title="shell"
# 读取 chip_id 验证通信
i2cget -y 1 0x1a 0x00 w

# 连续读写 1000 次测试稳定性
for i in $(seq 1 1000); do
    i2cget -y 1 0x1a 0x00 w > /dev/null
    if [ $? -ne 0 ]; then
        echo "Failed at iteration $i"
        break
    fi
done
```

### Step 4：逐步提高频率

100KHz → 400KHz → 1MHz → 3.4MHz，逐级测试。

---

## 实验结果

| 时钟频率 | 连续 1000 次读写 | 状态 |
|---|---|---|
| 100 KHz (标准模式) | ✅ 全部成功 | 稳定 |
| 400 KHz (快速模式) | ✅ 全部成功 | 稳定 |
| 1 MHz (快速模式+) | ✅ 全部成功 | 稳定 |
| 3.4 MHz (高速模式) | ❌ 频繁失败 | 不稳定 |

---

## 结论

IMX477 在 RV1126B 平台上最高可稳定运行在 **1 MHz** I2C 时钟频率。400KHz 是更保守、更通用的选择。

---

## 经验

1. 新设备先从 100KHz 开始调试，确保通信正常
2. 提高频率前确认硬件上拉电阻匹配
3. 1MHz 以上需要确认 Sensor 规格书支持
4. 高速模式（3.4MHz）需要特殊的 I2C 控制器支持

---

## 相关知识

- [I2C 驱动](/knowledge/driver/i2c)
- Sensor 上电时序

## 相关 Debug

- [I2C 读写失败 - 时钟频率问题](/debug/i2c-clock-fail)
