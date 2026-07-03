<template>
  <div class="console-bg">
    <!-- 静态网格背景 -->
    <div class="grid-lines"></div>
    <!-- 微妙的扫描线效果 -->
    <div class="scan-line"></div>
    <!-- 角落装饰 -->
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
  </div>
</template>

<style scoped>
.console-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 网格线 — 示波器/控制台风格 */
.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* 扫描线动画 — 非常 subtle */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.03), transparent);
  animation: scan 8s linear infinite;
  opacity: 0.5;
}

@keyframes scan {
  0% { top: -2px; }
  100% { top: 100vh; }
}

/* 角落装饰 — 像示波器的边角标记 */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: rgba(148, 163, 184, 0.06);
  border-style: solid;
}

.corner-tl {
  top: 80px;
  left: 20px;
  border-width: 1px 0 0 1px;
}

.corner-tr {
  top: 80px;
  right: 20px;
  border-width: 1px 1px 0 0;
}

.corner-bl {
  bottom: 20px;
  left: 20px;
  border-width: 0 0 1px 1px;
}

.corner-br {
  bottom: 20px;
  right: 20px;
  border-width: 0 1px 1px 0;
}
</style>
