<template>
  <div class="pagination-container card">
    <div class="pagination-info text-secondary">
      <span class="info-showing">Showing {{ startItem }}-{{ endItem }}</span>
      <span class="info-separator">•</span>
      <span class="info-total">of {{ totalItems }} entries</span>
    </div>

    <div class="pagination-controls">
      <!-- Left navigation buttons -->
      <div class="nav-buttons nav-buttons--left">
        <button
          @click="goToPage(1)"
          :disabled="currentPage === 1"
          class="btn btn--ghost btn--sm"
        >
          ⏮️ First
        </button>

        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="btn btn--ghost btn--sm"
        >
          ⬅️ Prev
        </button>
      </div>

      <!-- Page numbers -->
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="page !== '...' ? goToPage(page) : null"
          :disabled="page === '...'"
          :class="['btn btn--sm',
            page === currentPage ? 'btn--primary' :
            page === '...' ? 'btn--ghost btn--disabled' : 'btn--ghost'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Right navigation buttons -->
      <div class="nav-buttons nav-buttons--right">
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="btn btn--ghost btn--sm"
        >
          Next ➡️
        </button>

        <button
          @click="goToPage(totalPages)"
          :disabled="currentPage === totalPages"
          class="btn btn--ghost btn--sm"
        >
          Last ⏭️
        </button>
      </div>
    </div>

    <div class="items-per-page">
      <label for="itemsPerPage" class="form-label">Per page:</label>
      <select
        id="itemsPerPage"
        :value="itemsPerPage"
        @change="$emit('update:itemsPerPage', parseInt($event.target.value))"
        class="form-select"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:currentPage', 'update:itemsPerPage'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const startItem = computed(() => {
  return props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  margin-top: var(--spacing-sm);
  flex-wrap: wrap;
  gap: var(--spacing-md);
  min-height: auto;
}

.pagination-info {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.info-showing,
.info-total {
  display: inline;
}

.info-separator {
  display: inline;
  margin: 0 var(--spacing-xs);
  color: var(--text-muted);
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.nav-buttons {
  display: flex;
  gap: var(--spacing-xs);
}

.page-numbers {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: center;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  white-space: nowrap;
}

.items-per-page .form-label {
  font-size: 0.875rem;
  margin: 0;
  color: var(--text-secondary);
}

.items-per-page .form-select {
  min-width: 80px;
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .pagination-container {
    gap: var(--spacing-md);
  }

  .pagination-controls {
    gap: var(--spacing-xs);
  }
}

/* Mobile breakpoint */
@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-lg);
    text-align: center;
  }

  .pagination-info {
    order: 1;
    text-align: center;
    flex-direction: row;
    gap: var(--spacing-xs);
    white-space: nowrap;
    justify-content: center;
  }

  .info-showing,
  .info-total {
    display: inline;
  }

  .info-separator {
    display: none;
  }

  .items-per-page {
    order: 2;
    justify-content: center;
  }

  .pagination-controls {
    order: 3;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .nav-buttons {
    justify-content: center;
  }

  .page-numbers {
    order: 3;
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* Phone breakpoint */
@media (max-width: 480px) {
  .pagination-container {
    padding: var(--spacing-sm);
    gap: var(--spacing-md);
  }

  .nav-buttons .btn {
    min-width: 100px;
    font-size: 0.8rem;
  }

  .page-numbers .btn {
    min-width: 40px;
    height: 40px;
  }
}
</style>
