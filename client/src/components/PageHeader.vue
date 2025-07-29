<template>
  <div class="page-header">
    <div class="page-title-section">
      <h1 class="page-title">{{ title }}</h1>
      <p class="page-subtitle" v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="page-actions" v-if="$slots.actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 0 3rem;
  border-bottom: 1px solid rgba(51, 51, 102, 0.3);
  width: 100%;
  margin-bottom: 2rem;
}

.page-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-title {
  margin: 0;
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  margin: 0;
  color: #e2e8f0;
  font-size: 1.1rem;
  opacity: 0.8;
  font-weight: 400;
}

.page-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    align-items: center;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .page-actions {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }
}
</style>
