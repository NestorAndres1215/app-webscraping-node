<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { obtenerNoticias } from "./services/noticiaService";
import NoticiaCard from "./components/NoticiaCard.vue";
import type { Noticia } from "./types/noticia";

const noticias = ref<Noticia[]>([]);
const mensaje = ref("");
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = 6;
const searchQuery = ref("");
const activeCategory = ref("Todas");

const categories = computed(() => {
  const cats = new Set(noticias.value.map((n) => n.categoria || "General"));
  return ["Todas", ...Array.from(cats)];
});

const filteredNoticias = computed(() => {
  let result = noticias.value;
  if (activeCategory.value !== "Todas") {
    result = result.filter(
      (n) => (n.categoria || "General") === activeCategory.value
    );
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (n) =>
        n.titulo.toLowerCase().includes(q) ||
        (n.descripcion || "").toLowerCase().includes(q)
    );
  }
  return result;
});

const totalPages = computed(() =>
  Math.ceil(filteredNoticias.value.length / itemsPerPage)
);

const paginatedNoticias = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredNoticias.value.slice(start, start + itemsPerPage);
});

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  return pages;
});

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setCategory(cat: string) {
  activeCategory.value = cat;
  currentPage.value = 1;
}

onMounted(async () => {
  try {
    await new Promise((r) => setTimeout(r, 800));
    const response = await obtenerNoticias();
    if (response.success) {
      noticias.value = response.data;
    } else {
      mensaje.value = response.mensaje || "No hay noticias disponibles";
    }
  } catch (error) {
    mensaje.value = "Error al conectar con el servidor";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="app">
    <!-- Background decoration -->
    <div class="bg-grid"></div>
    <div class="bg-glow"></div>

    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="brand">
          <span class="brand-dot"></span>
          <span class="brand-name">NOTICIAS</span>
          <span class="brand-live">EN VIVO</span>
        </div>
        <div class="search-wrap">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input v-model="searchQuery" class="search-input" placeholder="Buscar noticias..." @input="currentPage = 1" />
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <p class="hero-eyebrow">Últimas noticias del mundo</p>
        <h1 class="hero-title">
          Mantente <span class="hero-accent">informado</span><br />en tiempo real
        </h1>
        <p class="hero-sub">
          {{ filteredNoticias.length }} artículos disponibles
        </p>
      </div>
    </section>

    <!-- Categories -->
    <nav class="categories">
      <div class="categories-inner">
        <button v-for="cat in categories" :key="cat" class="cat-btn" :class="{ active: activeCategory === cat }"
          @click="setCategory(cat)">
          {{ cat }}
        </button>
      </div>
    </nav>

    <!-- Main content -->
    <main class="main">
      <!-- Loading skeleton -->
      <div v-if="loading" class="skeleton-grid">
        <div v-for="i in 6" :key="i" class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-lines">
            <div class="skeleton-line w80"></div>
            <div class="skeleton-line w60"></div>
            <div class="skeleton-line w90"></div>
            <div class="skeleton-line w40"></div>
          </div>
        </div>
      </div>

      <!-- Error / empty -->
      <Transition name="fade">
        <div v-if="!loading && mensaje" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path
                d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>
          <p class="empty-title">{{ mensaje }}</p>
          <p class="empty-sub">Intenta de nuevo más tarde</p>
        </div>
      </Transition>

      <!-- News grid -->
      <TransitionGroup v-if="!loading && !mensaje" name="cards" tag="div" class="news-grid">
        <NoticiaCard v-for="(noticia, i) in paginatedNoticias" :key="noticia.titulo" :noticia="noticia"
          :style="{ '--delay': `${i * 60}ms` }" class="card-item" />
      </TransitionGroup>

      <!-- No results -->
      <Transition name="fade">
        <div v-if="!loading && !mensaje && filteredNoticias.length === 0" class="no-results">
          <p>No se encontraron noticias para "<strong>{{ searchQuery }}</strong>"</p>
        </div>
      </Transition>

      <!-- Pagination -->
      <Transition name="fade">
        <nav v-if="!loading && totalPages > 1" class="pagination" aria-label="Paginación">
          <button class="page-btn arrow" :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
            aria-label="Anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button v-for="page in pageNumbers" :key="page" class="page-btn" :class="{ active: page === currentPage }"
            @click="changePage(page)">
            {{ page }}
          </button>

          <button class="page-btn arrow" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)"
            aria-label="Siguiente">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </nav>
      </Transition>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <span class="brand-name footer-brand">NOTICIAS</span>
        <span class="footer-copy">© {{ new Date().getFullYear() }} — Todos los derechos reservados</span>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #080b12;
  --surface: #0f1420;
  --surface2: #161c2e;
  --border: rgba(255, 255, 255, 0.07);
  --border-hover: rgba(255, 255, 255, 0.15);
  --text: #e8eaf0;
  --text-muted: #6b7280;
  --accent: #3b82f6;
  --accent-glow: rgba(59, 130, 246, 0.3);
  --accent2: #06b6d4;
  --green: #10b981;
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --radius: 16px;
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}

/* Background */
.bg-grid {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.bg-glow {
  position: fixed;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 600px;
  background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(8, 11, 18, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 1200px;
  margin: auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 12px var(--green);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    box-shadow: 0 0 12px var(--green);
    opacity: 1;
  }

  50% {
    box-shadow: 0 0 20px var(--green);
    opacity: 0.7;
  }
}

.brand-name {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.12em;
  background: linear-gradient(135deg, #fff 40%, var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-live {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--green);
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 2px 8px;
  border-radius: 999px;
}

.footer-brand {
  font-size: 14px;
}

/* Search */
.search-wrap {
  position: relative;
  flex: 1;
  max-width: 380px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 42px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

/* Hero */
.hero {
  position: relative;
  z-index: 1;
  padding: 72px 24px 48px;
  text-align: center;
  animation: heroIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes heroIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.hero-inner {
  max-width: 640px;
  margin: auto;
}

.hero-eyebrow {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(38px, 6vw, 64px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.hero-accent {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-sub {
  color: var(--text-muted);
  font-size: 15px;
}

/* Categories */
.categories {
  position: relative;
  z-index: 1;
  padding: 0 24px 32px;
  overflow-x: auto;
  scrollbar-width: none;
}

.categories::-webkit-scrollbar {
  display: none;
}

.categories-inner {
  max-width: 1200px;
  margin: auto;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cat-btn {
  padding: 7px 18px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.cat-btn:hover {
  border-color: var(--border-hover);
  color: var(--text);
}

.cat-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 0 20px var(--accent-glow);
}

/* Main */
.main {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: auto;
  padding: 0 24px 80px;
}

/* Skeleton */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.skeleton-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.skeleton-img {
  height: 200px;
  background: linear-gradient(135deg, var(--surface2) 0%, var(--border) 100%);
}

.skeleton-lines {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: var(--surface2);
}

.w40 {
  width: 40%;
}

.w60 {
  width: 60%;
}

.w80 {
  width: 80%;
}

.w90 {
  width: 90%;
}

/* News grid */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.card-item {
  animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms) both;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

/* TransitionGroup */
.cards-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.cards-leave-active {
  transition: all 0.25s ease;
}

.cards-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}

.cards-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.cards-move {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Empty state */
.empty-state,
.no-results {
  text-align: center;
  padding: 80px 24px;
  color: var(--text-muted);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  color: var(--text-muted);
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.empty-sub {
  font-size: 14px;
}

.no-results {
  font-size: 16px;
}

.no-results strong {
  color: var(--text);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 56px;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.page-btn svg {
  width: 16px;
  height: 16px;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
}

.page-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 0 20px var(--accent-glow);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-btn.arrow {
  font-size: 18px;
}

/* Footer */
.footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--border);
  padding: 24px;
}

.footer-inner {
  max-width: 1200px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-copy {
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 600px) {
  .hero {
    padding: 48px 16px 32px;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }

  .header-inner {
    padding: 0 16px;
  }

  .search-wrap {
    max-width: none;
  }
}
</style>