<template>
  <div class="comments-section">
    <h3>💬 评论讨论</h3>
    <div class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <div class="comment-avatar">{{ comment.author.charAt(0) }}</div>
          <div class="comment-meta">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-time">{{ comment.time }}</span>
          </div>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
        <div class="comment-actions">
          <button class="action-btn">👍 {{ comment.likes }}</button>
          <button class="action-btn">💬 回复</button>
        </div>
      </div>
    </div>
    <div class="comment-input">
      <textarea placeholder="写下你的评论..." v-model="newComment"></textarea>
      <button class="submit-btn">发布评论</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newComment = ref('')

const comments = [
  {
    id: 1,
    author: '用户A',
    time: '2小时前',
    content: '更新后确实流畅了很多，点赞！',
    likes: 12
  },
  {
    id: 2,
    author: '用户B',
    time: '5小时前',
    content: '健康监测功能很实用，希望能继续优化！',
    likes: 8
  },
  {
    id: 3,
    author: '用户C',
    time: '昨天',
    content: '续航提升明显，一天下来还有40%电量！',
    likes: 15
  }
]
</script>

<style scoped>
.comments-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.comments-section h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.comment-item {
  background: var(--vp-c-bg);
  border-radius: 12px;
  padding: 1rem;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.comment-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #4f46e5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.comment-meta {
  display: flex;
  flex-direction: column;
}

.comment-author {
  font-weight: 600;
  color: var(--vp-c-text-primary);
}

.comment-time {
  font-size: 0.8rem;
  color: var(--vp-c-text-tertiary);
}

.comment-content {
  color: var(--vp-c-text-secondary);
  margin: 0 0 0.75rem 0;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  background: transparent;
  border: none;
  color: var(--vp-c-text-tertiary);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-brand);
}

.comment-input {
  margin-top: 1.5rem;
}

.comment-input textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;
  font-size: 0.9rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-primary);
}

.comment-input textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.submit-btn {
  margin-top: 0.75rem;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #8b5cf6, #4f46e5);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
