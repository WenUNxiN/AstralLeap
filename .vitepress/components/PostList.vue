<template>
  <div class="post-list">
    <div
      v-for="post in posts"
      :key="post.path"
      class="post-card"
    >
      <div class="post-header">
        <span class="post-category">{{ post.category }}</span>
        <span class="post-date">{{ post.date }}</span>
      </div>
      <h3 class="post-title">
        <a :href="post.path">{{ post.title }}</a>
      </h3>
      <p class="post-excerpt">{{ post.excerpt }}</p>
      <div class="post-footer">
        <span class="post-author">作者: {{ post.author }}</span>
        <span class="post-comments">💬 {{ post.comments }} 评论</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const posts = [
  {
    title: '星序AstralOrder最新固件更新体验',
    excerpt: '新版本带来了全新的健康监测功能和性能优化，快来分享你的使用感受！',
    category: '产品讨论',
    date: '2024-01-15',
    author: '星跃用户',
    comments: 23,
    path: '/forum/posts/firmware-update'
  },
  {
    title: '如何自定义表盘样式？',
    excerpt: '详细教程教你如何打造独一无二的表盘外观，支持自定义背景、指针和小组件。',
    category: '技术交流',
    date: '2024-01-14',
    author: '技术达人',
    comments: 15,
    path: '/forum/posts/custom-watch-face'
  },
  {
    title: '电池续航优化技巧',
    excerpt: '分享一些实用的电池省电技巧，让你的智能手表续航更持久。',
    category: '产品讨论',
    date: '2024-01-13',
    author: '省电专家',
    comments: 31,
    path: '/forum/posts/battery-tips'
  },
  {
    title: '第三方应用推荐',
    excerpt: '盘点那些值得安装的第三方应用，提升你的智能手表使用体验。',
    category: '社区活动',
    date: '2024-01-12',
    author: '应用达人',
    comments: 18,
    path: '/forum/posts/app-recommendations'
  }
]
</script>

<style scoped>
.post-list {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

.post-card {
  background: var(--vp-c-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.post-category {
  background: linear-gradient(135deg, #8b5cf6, #4f46e5);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.post-date {
  color: var(--vp-c-text-secondary);
  font-size: 0.875rem;
}

.post-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.post-title a {
  color: var(--vp-c-text-primary);
  text-decoration: none;
}

.post-title a:hover {
  color: var(--vp-c-brand);
}

.post-excerpt {
  color: var(--vp-c-text-secondary);
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  line-height: 1.6;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--vp-c-text-tertiary);
  font-size: 0.875rem;
}
</style>
