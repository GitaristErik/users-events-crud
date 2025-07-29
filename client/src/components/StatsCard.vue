<template>
  <div class="stats-card" :class="{ 'narrow': narrow }">
    <h3 class="card-title">{{ title }}</h3>
    <div class="stats-grid">
      <div v-for="(stat, index) in stats" :key="index" class="stat-wrapper">
        <div class="stat-item" :style="{ background: `linear-gradient(135deg, ${stat.color}DD, ${stat.color})` }">
          <div class="stat-number">{{ stat.value }}</div>
        </div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '📊 Statistics'
  },
  stats: {
    type: Array,
    required: true
  },
  narrow: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.stats-card {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #333366;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 2;
  max-width: 100%;
  transform: translateY(0);
  height: fit-content;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
}

.stats-card.narrow {
  flex: 0 0 25%;
  max-width: 25%;
  transform: scale(1);
}

.card-title {
  margin: 0 0 1.5rem 0;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  justify-items: center;
  transition: all 0.4s ease;
}

.stats-card.narrow .stats-grid {
  grid-template-columns: 1fr;
  gap: 1rem;
}

.stat-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.stat-wrapper:nth-child(1) {
  animation-delay: 0.1s;
}

.stat-wrapper:nth-child(2) {
  animation-delay: 0.2s;
}

.stat-wrapper:nth-child(3) {
  animation-delay: 0.3s;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  border: 3px solid #333366;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.stat-item:hover::before {
  transform: translateX(100%);
}

.stats-card.narrow .stat-item {
  width: 70px;
  height: 70px;
}

.stat-item:hover {
  transform: scale(1.15) rotate(10deg);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.5);
}

.stats-card.narrow .stat-item:hover {
  transform: scale(1.1) rotate(5deg);
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  line-height: 1;
}

.stats-card.narrow .stat-number {
  font-size: 1.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #e2e8f0;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  background: rgba(26, 26, 46, 0.8);
  border-radius: 20px;
  border: 1px solid #333366;
  backdrop-filter: blur(10px);
  min-width: 120px;
}

.stat-wrapper:hover .stat-label {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  transform: translateY(-3px);
}

.stats-card.narrow .stat-label {
  font-size: 0.75rem;
  min-width: 100px;
  padding: 0.4rem 0.8rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .stats-card.narrow {
    max-width: 100%;
    transform: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .stat-item {
    width: 100px;
    height: 100px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.75rem;
    min-width: 140px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    gap: 1rem;
  }

  .stat-item {
    width: 90px;
    height: 90px;
  }

  .stat-number {
    font-size: 1.3rem;
  }

  .stat-label {
    font-size: 0.7rem;
    min-width: 120px;
    padding: 0.4rem 0.8rem;
  }
}
</style>
