<script setup lang="ts">
import type { Noticia } from "../types/noticia";

defineProps<{
  noticia: Noticia;
}>();
</script>

<template>
  <article class="card">
    <div class="card-top">
      <span v-if="noticia.categoria" class="card-badge">{{ noticia.categoria }}</span>
      <span v-if="noticia.fecha" class="card-date">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
        {{ noticia.fecha }}
      </span>
    </div>

    <div class="card-body">
      <h2 class="card-title">{{ noticia.titulo }}</h2>
      <p v-if="noticia.descripcion" class="card-desc">{{ noticia.descripcion }}</p>
    </div>

    <div class="card-footer">
      <span v-if="noticia.autor" class="card-author">
        <span class="author-avatar">{{ noticia.autor.charAt(0).toUpperCase() }}</span>
        {{ noticia.autor }}
      </span>
      <a
        v-if="noticia.link"
        :href="noticia.link"
        target="_blank"
        rel="noopener noreferrer"
        class="card-link"
      >
        Leer más
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>

    <div class="card-accent-bar"></div>
    <div class="card-glow"></div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--surface, #0f1420);
  border: 1px solid var(--border, rgba(255,255,255,0.07));
  border-radius: var(--radius, 16px);
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
              border-color 0.3s,
              box-shadow 0.35s;
  will-change: transform;
}

.card:hover {
  transform: translateY(-5px);
  border-color: rgba(59,130,246,0.3);
  box-shadow: 0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(59,130,246,0.1);
}

.card:hover .card-glow { opacity: 1; }
.card:hover .card-accent-bar { transform: scaleX(1); }
.card:hover .card-link svg { transform: translateX(5px); }
.card:hover .card-title { color: #fff; }

/* Accent bar bottom */
.card-accent-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent, #3b82f6), var(--accent2, #06b6d4));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(500px circle at 50% 120%, rgba(59,130,246,0.06), transparent 60%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

/* Top row */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.card-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--accent2, #06b6d4);
  background: rgba(6,182,212,0.1);
  border: 1px solid rgba(6,182,212,0.2);
  padding: 3px 10px;
  border-radius: 999px;
}

.card-date {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-muted, #6b7280);
  font-weight: 500;
}

.card-date svg { width: 12px; height: 12px; }

/* Body */
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-title {
  font-family: var(--font-display, 'Syne', sans-serif);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--text, #e8eaf0);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}

.card-desc {
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-muted, #6b7280);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border, rgba(255,255,255,0.07));
}

.card-author {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted, #6b7280);
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author-avatar {
  flex-shrink: 0;
  width: 26px; height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent, #3b82f6), var(--accent2, #06b6d4));
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent, #3b82f6);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.2s;
}

.card-link:hover { color: var(--accent2, #06b6d4); }

.card-link svg {
  width: 14px; height: 14px;
  transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
}
</style>