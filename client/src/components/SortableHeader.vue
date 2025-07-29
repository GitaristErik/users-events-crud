<template>
  <th
    :class="['sortable-header', { active: isActive }]"
    @click="handleSort"
  >
    <div class="header-content">
      <slot />
      <div class="sort-icons">
        <span
          :class="['sort-icon', 'sort-asc', { active: isActive && sortDirection === 'asc' }]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14l5-5 5 5z"/>
          </svg>
        </span>
        <span
          :class="['sort-icon', 'sort-desc', { active: isActive && sortDirection === 'desc' }]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </span>
      </div>
    </div>
  </th>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  field: {
    type: String,
    required: true
  },
  currentSort: {
    type: String,
    default: ''
  },
  currentDirection: {
    type: String,
    default: 'asc'
  }
})

const emit = defineEmits(['sort'])

const isActive = computed(() => props.currentSort === props.field)
const sortDirection = computed(() => props.currentDirection)

const handleSort = () => {
  let newDirection = 'asc'

  if (isActive.value) {
    newDirection = sortDirection.value === 'asc' ? 'desc' : 'asc'
  }

  emit('sort', {
    field: props.field,
    direction: newDirection
  })
}
</script>

<style scoped>
.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  position: relative;
}

.sortable-header:hover {
  background: rgba(102, 126, 234, 0.1);
}

.sortable-header.active {
  background: rgba(102, 126, 234, 0.2);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.sort-icons {
  display: flex;
  flex-direction: column;
  line-height: 1;
  gap: 2px;
}

.sort-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  border-radius: 3px;
  padding: 2px;
}

.sort-icon svg {
  transition: all 0.3s ease;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
}

.sort-icon.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.2);
}

.sort-icon.active svg {
  filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3));
}

.sort-icon:hover {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
}
</style>
