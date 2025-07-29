<template>
  <main class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <div class="page-title-section">
          <h1 class="page-title">👥 Users Management</h1>
          <p class="page-subtitle">Manage and view all registered users</p>
        </div>
        <div class="page-actions">
          <button class="btn btn--primary" @click="showForm = !showForm">
            {{ showForm ? '✕ Cancel' : '+ Create User' }}
          </button>
        </div>
      </div>

      <div class="content-layout" :class="{ 'form-visible': showForm }">
        <StatsCard
          title="📊 Statistics"
          :stats="statsData"
          :narrow="showForm"
        />

        <transition name="slide-fade">
          <div v-if="showForm" class="form-container">
            <UserForm @created="fetchUsers" />
          </div>
        </transition>
      </div>

      <div class="table-container">
        <TableUniversal
          title="👥 Users List"
          :data="tableUsers"
          :columns="usersColumns"
          search-placeholder="🔍 Search users..."
          empty-icon="👥"
          empty-title="No Users Found"
          empty-message="Start by creating your first user!"
          default-sort="fullName"
          default-direction="asc"
          @sort="handleSort"
        >
          <!-- User Name Column Template with clickable links -->
          <template #cell-fullName="{ item }">
            <router-link :to="`/user/${item.id}`" class="user-link">
              {{ item.fullName }}
            </router-link>
          </template>

          <!-- Next Event Date Column Template -->
          <template #cell-nextEventDate="{ item }">
            <div v-if="item.nextEventDateRaw" class="date-cell">
              <div class="date-main">{{ formatDateOnly(item.nextEventDateRaw) }}</div>
              <div class="date-time">{{ formatTimeOnly(item.nextEventDateRaw) }}</div>
            </div>
            <span v-else class="no-date">-</span>
          </template>

          <!-- Events Count Column Template -->
          <template #cell-eventsCount="{ item }">
            <span class="badge" :class="item.eventsCount > 0 ? 'badge-success' : 'badge-secondary'">
              {{ item.eventsCount }}
            </span>
          </template>
        </TableUniversal>
      </div>
    </div>
  </main>
</template><script setup>
import { ref, onMounted, computed } from 'vue'
import UserForm from '../components/UserForm.vue'
import TableUniversal from '../components/TableUniversal.vue'
import StatsCard from '../components/StatsCard.vue'
import { useApi } from '@/composables/useApi'
import { useErrorHandling } from '@/composables/useErrorHandling'
import { formatDate, formatTime, showErrorMessage } from '../utils/helpers'
import { MESSAGES } from '../constants'

const users = ref([])
const showForm = ref(false)

// Composables
const { fetchUsers: getUsers } = useApi()
const { setApiError, clearErrors } = useErrorHandling()

// Table Configuration
const usersColumns = [
  { field: 'fullName', label: '👤 User Name', sortable: true },
  { field: 'email', label: '📧 Email', sortable: true },
  { field: 'phoneNumber', label: '📞 Phone', sortable: true },
  { field: 'eventsCount', label: '📅 Events', sortable: true },
  { field: 'nextEventDate', label: '⏰ Next Event', sortable: true }
]

// Table Data
const tableUsers = computed(() => {
  return users.value.map(user => ({
    id: user._id,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phoneNumber: user.phoneNumber,
    eventsCount: user.eventsCount || 0,
    nextEventDate: formatDate(user.nextEventDate),
    nextEventDateRaw: user.nextEventDate // Raw date for template
  }))
})

const fetchUsers = async () => {
  try {
    clearErrors()
    users.value = await getUsers()
  } catch (error) {
    setApiError(error)
    showErrorMessage(MESSAGES.ERROR.USERS_FETCH_FAILED)
    users.value = []
  }
}

const formatDateOnly = (d) => {
  if (!d) return '-'
  try {
    const date = new Date(d)
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return '-'
  }
}

const formatTimeOnly = (d) => {
  if (!d) return '-'
  try {
    const date = new Date(d)
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  } catch (error) {
    return '-'
  }
}

const handleSort = ({ field, direction }) => {
  // Sorting is handled by TableUniversal component
}

// Stats data for StatsCard component
const statsData = computed(() => [
  {
    value: users.value.length,
    label: '👥 Total Users',
    color: '#667eea'
  },
  {
    value: usersWithEvents.value,
    label: '🎯 Active Users',
    color: '#10b981'
  },
  {
    value: totalEvents.value,
    label: '📅 Total Events',
    color: '#f59e0b'
  }
])

const usersWithEvents = computed(() => {
  return users.value.filter(user => (user.eventsCount || 0) > 0).length
})

const totalEvents = computed(() => {
  return users.value.reduce((total, user) => total + (user.eventsCount || 0), 0)
})

onMounted(fetchUsers)
</script>

<style scoped>
/* Page-specific styles only - common styles moved to globals.css */

/* Specific button override for events */
.btn-events {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(245, 158, 11, 0.25);
  text-decoration: none;
}

.btn-events:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(245, 158, 11, 0.35);
}

/* Page-specific transition overrides */
.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateX(50px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

/* Page-specific pulse animation override */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  }
}
</style>
