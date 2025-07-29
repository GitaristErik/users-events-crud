<template>
  <div v-if="modelValue" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">
          <span v-if="icon" class="modal-icon">{{ icon }}</span>
          {{ title }}
        </h2>
        <button class="btn btn--icon btn--ghost modal-close-btn" @click="closeModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Modal'
  },
  icon: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--border-primary);
  background: var(--primary-gradient);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-icon {
  font-size: 1.5rem;
}

.modal-close-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  color: var(--text-primary) !important;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: scale(1.1);
}

.modal-body {
  padding: var(--spacing-xl);
}

@media (max-width: 768px) {
  .modal-header {
    padding: var(--spacing-md) var(--spacing-lg);
  }

  .modal-body {
    padding: var(--spacing-lg);
  }

  .modal-title {
    font-size: 1.1rem;
  }
}
</style>
