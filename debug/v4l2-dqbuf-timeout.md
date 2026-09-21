---
title: VIDIOC_DQBUF Timeout
description: V4L2 采集时 DQBUF 超时问题排查记录
date: 2026-09-19
category:
  - V4L2
  - Camera
tags:
  - V4L2
  - timeout
  - MIPI
platform:
  - RV1106G2
status: solved
---

# VIDIOC_DQBUF Timeout

## 现象

使用 V4L2 MMAP 模式采集视频时，`VIDIOC_DQBUF` 调用阻塞，超时后返回 `-1`，`errno = 110 (Connection timed out)`。

```
VIDIOC_DQBUF failed: Connection timed out
```

## 环境

| 项目 | 内容 |
|---|---|
| 开发板 | RV1106G2 |
| 内核版本 | 5.10.x |
| SDK | RV1106 SDK v1.5 |
| Camera Sensor | IMX477 |
| 分辨率 | 1920×1080 |
| 格式 | YUYV |

## 错误日志

```text title="dmesg"
[  123.456789] rkisp1 rkisp1: stream on timeout
[  123.456800] rkisp1 rkisp1: no frame received in 2000ms
[  123.456811] video4linux video0: dqbuf timeout
```

```text title="v4l2-ctl --log-status"
VIDIOC_DQBUF: failed: Connection timed out
```

---

## 初步判断

可能的原因（按概率排序）：

1. Sensor 未上电或未正常工作
2. MIPI CSI 链路未建立
3. 设备树配置错误
4. ISP 驱动问题
5. V4L2 缓冲配置问题

---

## 排查过程

### 第一步：检查 Sensor 电源

```bash title="shell"
# 检查 Sensor 供电引脚电平
# 检查 reset 引脚状态
# 检查 pwdn 引脚状态
```

**结果**：电源正常，reset 和 pwdn 均为释放状态。

### 第二步：检查 I2C 通信

```bash title="shell"
i2cdetect -y 1
```

**结果**：可以扫描到 Sensor 地址 `0x1a`，读取 chip_id 正常。说明 I2C 通信正常，Sensor 已上电。

### 第三步：检查 MIPI CSI 信号

```bash title="shell"
# 查看 MIPI D-PHY 状态
cat /sys/kernel/debug/mipi_dphy/status

# 或者查看 ISP 状态
cat /sys/kernel/debug/rkisp1/status
```

**结果**：MIPI D-PHY 未锁定（unlocked），没有接收到数据。

### 第四步：检查设备树配置

检查设备树中 Sensor 节点的 port 配置：

```dts title="设备树片段"
camera-sensor@1a {
    compatible = "sony,imx477";
    reg = <0x1a>;
    // ...

    port {
        imx477_out: endpoint {
            remote-endpoint = <&mipi_csi_in>;
            data-lanes = <1 2 3 4>;
            clock-noncontinuous;
        };
    };
};
```

**问题发现**：`remote-endpoint` 指向的 `&mipi_csi_in` 节点路径写错了，实际应该指向 `&csi2_dphy0_in`。

### 第五步：验证修复

修改设备树中 `remote-endpoint` 为正确的节点，重新编译并烧录。

```bash title="shell"
# 启动流后检查 MIPI 状态
v4l2-ctl -d /dev/video0 --stream-mmap --stream-count=10
```

**结果**：成功采集到 10 帧，DQBUF 正常返回。

---

## 根因

设备树中 Sensor 的 `port` 节点 `remote-endpoint` 配置错误，导致 MIPI CSI 链路未建立，Sensor 输出的数据没有被正确接收，因此 V4L2 驱动一直等不到帧数据，最终超时。

---

## 解决方案

修正设备树中 Sensor 节点的 `remote-endpoint` 指向，使其与 CSI D-PHY 的输入端点匹配。

```dts title="修复后"
port {
    imx477_out: endpoint {
        remote-endpoint = <&csi2_dphy0_in>;  // 修正此处
        data-lanes = <1 2 3 4>;
        clock-noncontinuous;
    };
};
```

---

## 验证

- ✅ `VIDIOC_DQBUF` 正常返回帧数据
- ✅ 1080P 30FPS 稳定采集
- ✅ MIPI D-PHY 状态显示 locked
- ✅ `v4l2-ctl --stream-mmap` 输出帧率正常

---

## 最终状态

🟢 **已解决** · 已验证

---

## 经验总结

1. **DQBUF 超时首先查链路**：从 Sensor 电源 → I2C → MIPI → ISP → V4L2 逐级排查
2. **善用 v4l2-ctl --log-status**：可以快速定位是哪一层出了问题
3. **设备树是重灾区**：新增 Sensor 时 port/endpoint 配置最容易出错
4. **检查 data-lanes 映射**：data-lanes 的顺序和数量也要确认正确

---

## 相关知识

- [V4L2 子系统](/knowledge/camera/v4l2)
- MIPI CSI
- Sensor 上电时序

---

## 相关实验

- [#022 V4L2 MMAP 视频采集实验](/experiments/022-v4l2-mmap)
