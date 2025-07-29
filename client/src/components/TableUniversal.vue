<template>
  <div class="table-container">
    <div class="table-header" v-if="title || searchable">
      <h3 class="table-title" v-if="title">{{ title }}</h3>
      <div class="seaconst formatCellValue = (item, column) => {
  if (!column.field) return ''
  const value = getNestedValue(item, column.field)

  if (column.field.includes('Date') || column.field.includes('date')) {
    if (!value) return '-'

    // Return just the date part - time will be handled via slot
    const date = new Date(value)
    const dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
    return date.toLocaleDateString('en-US', dateOptions)
  }

  return value || ''
}iner" v-if="searchable">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
        />
      </div>
    </div>

    <table class="modern-table">
      <thead>
        <tr>
          <template v-for="column in columns" :key="column.field">
            <SortableHeader
              v-if="column.sortable !== false"
              :field="column.field"
              :currentSort="sortField"
              :currentDirection="sortDirection"
              @sort="handleSort"
            >
              {{ column.label }}
            </SortableHeader>
            <th v-else class="non-sortable">
              {{ column.label }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item[itemKey]">
          <td v-for="column in columns" :key="column.field" :class="column.cellClass">
            <slot :name="`cell-${column.field}`" :item="item" :value="getNestedValue(item, column.field)">
              {{ formatCellValue(item, column) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="paginatedData.length === 0" class="empty-state">
      <div class="empty-icon">{{ emptyIcon }}</div>
      <h3 class="empty-title">{{ emptyTitle }}</h3>
      <p class="empty-message">{{ emptyMessage }}</p>
    </div>

    <PaginationComponent
      v-if="paginatedData.length > 0"
      v-model:currentPage="currentPage"
      v-model:itemsPerPage="itemsPerPage"
      :totalItems="filteredData.length"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SortableHeader from './SortableHeader.vue'
import PaginationComponent from './PaginationComponent.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  searchable: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: '🔍 Search...'
  },
  emptyIcon: {
    type: String,
    default: '📄'
  },
  emptyTitle: {
    type: String,
    default: 'No Data Found'
  },
  emptyMessage: {
    type: String,
    default: 'There are no items to display.'
  },
  itemKey: {
    type: String,
    default: '_id'
  },
  defaultSort: {
    type: String,
    default: ''
  },
  defaultDirection: {
    type: String,
    default: 'asc'
  }
})

const emit = defineEmits(['sort'])

// Reactive state
const searchQuery = ref('')
const sortField = ref(props.defaultSort)
const sortDirection = ref(props.defaultDirection)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed
const filteredData = computed(() => {
  let filtered = props.data

  // Apply search filter
  if (searchQuery.value && props.searchable) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => {
      return props.columns.some(column => {
        const value = getNestedValue(item, column.field)
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query)
        }
        if (typeof value === 'number') {
          return value.toString().includes(query)
        }
        return false
      })
    })
  }

  // Apply sorting
  if (sortField.value) {
    filtered = [...filtered].sort((a, b) => {
      let aValue = getNestedValue(a, sortField.value)
      let bValue = getNestedValue(b, sortField.value)

      // Handle formatted date fields by getting the original date from actions
      if (sortField.value === 'startDateFormatted' || sortField.value === 'endDateFormatted') {
        const dateField = sortField.value === 'startDateFormatted' ? 'startDate' : 'endDate'
        aValue = a.actions?.[dateField] ? new Date(a.actions[dateField]) : new Date(0)
        bValue = b.actions?.[dateField] ? new Date(b.actions[dateField]) : new Date(0)
      }
      // Handle other date fields
      else if (sortField.value.includes('Date') || sortField.value.includes('date')) {
        aValue = aValue ? new Date(aValue) : new Date(0)
        bValue = bValue ? new Date(bValue) : new Date(0)
      }
      // Handle duration (convert to minutes for sorting)
      else if (sortField.value === 'duration') {
        aValue = convertDurationToMinutes(aValue)
        bValue = convertDurationToMinutes(bValue)
      }
      // Handle strings
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return filtered
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})

// Methods
const getNestedValue = (obj, path) => {
  if (!path || typeof path !== 'string') return ''
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const formatCellValue = (item, column) => {
  if (!column.field) return ''
  const value = getNestedValue(item, column.field)

  if (column.field.includes('Date') || column.field.includes('date')) {
    if (!value) return '-'

    // Return just the date part - time will be handled via slot
    const date = new Date(value)
    const dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
    return date.toLocaleDateString('en-US', dateOptions)
  }

  return value || ''
}

const calculateDurationMinutes = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.floor((end - start) / (1000 * 60))
}

// Convert duration string back to minutes for sorting
const convertDurationToMinutes = (durationStr) => {
  if (!durationStr || typeof durationStr !== 'string') return 0

  // Parse Ukrainian formats like "2 дні 5 год", "45 хв", "8 год"
  let totalMinutes = 0

  // Extract days
  const daysMatch = durationStr.match(/(\d+)\s*(?:день|дні|днів)/i)
  if (daysMatch) {
    totalMinutes += parseInt(daysMatch[1]) * 24 * 60
  }

  // Extract hours
  const hoursMatch = durationStr.match(/(\d+)\s*год/i)
  if (hoursMatch) {
    totalMinutes += parseInt(hoursMatch[1]) * 60
  }

  // Extract minutes
  const minutesMatch = durationStr.match(/(\d+)\s*хв/i)
  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1])
  }

  return totalMinutes
}

// Reset page when search query changes
watch(searchQuery, () => {
  currentPage.value = 1
})

const handleSort = (sortData) => {
  sortField.value = sortData.field
  sortDirection.value = sortData.direction
  currentPage.value = 1
  emit('sort', sortData)
}
</script>

<style scoped>
.table-container {
  background: #16213e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid #333366;
  width: 100%;
  animation: fadeInUp 0.8s ease-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;
  transition: all 0.3s ease;
}

.table-header {
  background: #1a1a2e;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333366;
}

.table-title {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-input {
  background: #16213e;
  border: 2px solid #333366;
  border-radius: 8px;
  color: #ffffff;
  padding: 0.75rem 1rem;
  width: 300px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.table-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  background: #16213e;
}

.modern-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modern-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  white-space: nowrap;
}

.modern-table th.non-sortable {
  cursor: default;
}

.modern-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #333366;
  vertical-align: middle;
  color: #e2e8f0;
  font-size: 0.875rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.modern-table td:last-child {
  white-space: normal;
  max-width: none;
  width: 120px;
}

.modern-table tbody tr {
  transition: background-color 0.2s ease;
}

.modern-table tbody tr:hover {
  background-color: #1a1a2e;
}

.modern-table tbody tr:last-child td {
  border-bottom: none;
}

.empty-state {
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-title {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.empty-message {
  color: #9ca3af;
  font-size: 1rem;
  margin: 0;
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
  .table-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .search-input {
    width: 100%;
  }

  .modern-table th,
  .modern-table td {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
