---
title: MPP 类 Debug
description: MPP 编解码、格式转换相关问题记录
---

# 🎬 MPP 类 Debug 记录

> Rockchip MPP 编解码、RGA 格式转换相关的问题。

---

## 记录列表

| 标题 | 状态 | 平台 | 日期 |
|---|---|---|---|
| [MPP 编码输出花屏](mpp-encode-corrupt) | 🔍 排查中 | RK3566 | 2026-09-21 |

---

## 常见问题方向

### 编码相关
- 输出花屏（stride 对齐问题）
- 码率不准（码率控制模式）
- 延迟过大（B 帧 / 缓冲）
- 首帧出图慢（SPS/PPS）
- 编码失败（参数配置错误）

### 解码相关
- 解码花屏
- 首帧解码失败
- 内存不足

### RGA 相关
- 格式转换失败
- 颜色不对
- 性能不达预期
- MMU 地址问题

---

::: tip 调试技巧
1. 先确认输入数据正确（保存 YUV 文件用 ffplay 播放）
2. 检查 hor_stride / ver_stride 是否正确
3. 打开 MPP 的 debug 日志
4. 用官方 mpi_enc_test 工具对比
:::
