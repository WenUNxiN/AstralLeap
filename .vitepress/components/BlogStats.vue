<template>
  <div class="blog-stats">
    <div class="stat-item">
      <div class="stat-icon articles">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>
      <div class="stat-value">4</div>
      <div class="stat-label">文章总数</div>
    </div>
    <div class="stat-item">
      <div class="stat-icon views">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </div>
      <div class="stat-value">1.2k</div>
      <div class="stat-label">阅读量</div>
    </div>
    <div class="stat-item">
      <div class="stat-icon tags">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7" y2="7"></line>
        </svg>
      </div>
      <div class="stat-value">12</div>
      <div class="stat-label">标签数量</div>
    </div>
    <div class="stat-item">
      <div class="stat-icon comments">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </div>
      <div class="stat-value">28</div>
      <div class="stat-label">评论数</div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.blog-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .blog-stats {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-item {
  background: var(--vp-c-bg-alt);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-icon.articles {
  background: linear-gradient(135deg, #8b5cf6, #4f46e5);
}

.stat-icon.views {
  background: linear-gradient(135deg, #06b6d4, #0ea5e9);
}

.stat-icon.tags {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
}

.stat-icon.comments {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-tertiary);
}
</style>
