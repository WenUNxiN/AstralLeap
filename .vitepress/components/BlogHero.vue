<template>
  <div class="blog-hero">
    <div class="hero-bg"></div>
    <div class="hero-bg-glow"></div>
    <div class="hero-content">
      <div class="hero-icon-wrapper">
        <div class="hero-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="icon-ring"></div>
      </div>
      <h1>技术博客</h1>
      <p class="hero-subtitle">记录点滴成长，分享技术心得</p>
      <p class="hero-description">分享嵌入式开发、软硬件交互及项目实践经验，记录技术路上的所学所悟</p>
      <div class="hero-author">
        <div class="author-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="author-info">
          <span class="author-name">Stellan W</span>
          <span class="author-title">嵌入式工程师</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.blog-hero {
  text-align: center;
  padding: 4.5rem 2rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, rgba(139, 92, 246, 0.08) 0%, rgba(79, 70, 229, 0.06) 35%, rgba(6, 182, 212, 0.06) 70%, rgba(59, 130, 246, 0.04) 100%);
  border-radius: 28px;
  margin-bottom: 2rem;
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.hero-bg {
  position: absolute;
  top: -100%;
  left: -50%;
  width: 200%;
  height: 300%;
  background: 
    radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.06) 0%, transparent 60%);
  pointer-events: none;
}

.hero-bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.75rem;
}

.hero-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 
    0 12px 40px rgba(139, 92, 246, 0.35),
    0 4px 12px rgba(139, 92, 246, 0.2);
  position: relative;
  z-index: 2;
}

.hero-icon svg {
  width: 38px;
  height: 38px;
}

.icon-ring {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
  animation: pulse-ring 3s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.2;
  }
}

.blog-hero h1 {
  margin: 0 0 1rem 0;
  font-size: 2.75rem;
  font-weight: 800;
  color: var(--vp-c-brand);
  letter-spacing: -0.02em;
}

.hero-subtitle {
  margin: 0 0 1rem 0;
  font-size: 1.45rem;
  color: var(--vp-c-text-secondary);
  font-weight: 500;
  letter-spacing: 0.02em;
}

.hero-description {
  margin: 0 auto 2rem;
  max-width: 680px;
  color: var(--vp-c-text-tertiary);
  font-size: 1.05rem;
  line-height: 1.8;
}

.hero-author {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.75rem;
  background: var(--vp-c-bg-alt);
  border-radius: 9999px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.author-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #8b5cf6, #4f46e5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.author-avatar svg {
  width: 18px;
  height: 18px;
}

.author-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.author-name {
  font-weight: 600;
  color: var(--vp-c-text-primary);
  font-size: 0.95rem;
}

.author-title {
  font-size: 0.8rem;
  color: var(--vp-c-text-tertiary);
}
</style>
