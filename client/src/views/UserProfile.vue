<template>
  <main class="page-container">
    <div class="content-wrapper">
      <!-- Back Button -->
      <div class="back-navigation">
        <router-link to="/" class="back-btn">
          <span class="btn-icon">←</span>
          Back to Users
        </router-link>
      </div>

      <!-- Header Section using PageHeader -->
      <PageHeader
        :title="`👤 ${user?.firstName} ${user?.lastName}`"
        subtitle="User profile and event management"
      >
        <template #actions>
          <button class="btn btn--primary" @click="toggleForm" :class="{ active: showForm }">
            <span class="btn-icon">{{ showForm ? '✕' : '+' }}</span>
            {{ showForm ? 'Cancel' : 'Create Event' }}
          </button>
        </template>
      </PageHeader>

      <!-- User Details Cards (3 columns) -->
      <div class="user-details-container" v-if="user">
        <div class="detail-card email-card">
          <div class="card-icon">📧</div>
          <div class="card-content">
            <div class="card-label">Email</div>
            <div class="card-value">{{ user.email }}</div>
          </div>
        </div>
        <div class="detail-card phone-card">
          <div class="card-icon">📞</div>
          <div class="card-content">
            <div class="card-label">Phone</div>
            <div class="card-value">{{ user.phoneNumber }}</div>
          </div>
        </div>
        <div class="detail-card events-card">
          <div class="card-icon">📅</div>
          <div class="card-content">
            <div class="card-label">Events</div>
            <div class="card-value">{{ events.length }} total</div>
          </div>
        </div>
      </div>

      <!-- Form Modal -->
      <transition name="modal-fade">
        <div v-if="showForm" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <EventCrudForm
              :users="user ? [user] : []"
              :editing-event="editingEvent"
              :default-user-id="user?._id"
              @created="handleEventCreated"
              @updated="handleEventUpdated"
              @cancelled="handleFormCancel"
            />
          </div>
        </div>
      </transition>

      <!-- Events Table Section -->
      <div class="table-section">
        <TableUniversal
          title="📅 User Events"
          :data="tableEvents"
          :columns="eventsColumns"
          search-placeholder="🔍 Search user events..."
          empty-icon="📅"
          empty-title="No Events Found"
          empty-message="This user hasn't created any events yet. Start by creating one!"
          default-sort="startDateFormatted"
          default-direction="asc"
          @sort="handleSort"
        >
          <!-- Start Date Column Template -->
          <template #cell-startDateFormatted="{ item }">
            <div class="date-cell">
              <div class="date-main">{{ formatDate(item.actions.startDate) }}</div>
              <div class="date-time">{{ new Date(item.actions.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) }}</div>
            </div>
          </template>

          <!-- End Date Column Template -->
          <template #cell-endDateFormatted="{ item }">
            <div class="date-cell">
              <div class="date-main">{{ formatDate(item.actions.endDate) }}</div>
              <div class="date-time">{{ new Date(item.actions.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) }}</div>
            </div>
          </template>

          <!-- Actions Column Template -->
          <template #cell-actions="{ item }">
            <div class="action-buttons">
              <button @click="editEvent(item.actions)" class="btn btn--icon btn--primary" title="Edit Event">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
              <button @click="deleteEvent(item.actions._id)" class="btn btn--icon btn--danger" title="Delete Event">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          </template>

          <!-- Duration Column Template -->
          <template #cell-duration="{ item }">
            <span class="badge badge--primary badge--duration">{{ item.duration }}</span>
          </template>
        </TableUniversal>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import EventCrudForm from '../components/EventCrudForm.vue'
import TableUniversal from '../components/TableUniversal.vue'
import PageHeader from '../components/PageHeader.vue'
import { useApi } from '@/composables/useApi'
import { useErrorHandling } from '@/composables/useErrorHandling'
import { calculateDuration, formatDate, formatTime, showSuccessMessage, showErrorMessage } from '../utils/helpers'
import { MESSAGES } from '../constants'

const route = useRoute()
const user = ref(null)
const events = ref([])
const showForm = ref(false)
const editingEvent = ref(null)

// Composables
const { getUserById, deleteEvent: apiDeleteEvent } = useApi()
const { setApiError, clearErrors } = useErrorHandling()

// Table Configuration
const eventsColumns = [
  { field: 'title', label: '📝 Title', sortable: true },
  { field: 'description', label: '📋 Description', sortable: false },
  { field: 'startDateFormatted', label: '🚀 Start Date', sortable: true },
  { field: 'endDateFormatted', label: '🏁 End Date', sortable: true },
  { field: 'duration', label: '⏱️ Duration', sortable: true },
  { field: 'actions', label: '⚙️ Actions', sortable: false }
]

// Table Data
const tableEvents = computed(() => {
  if (!events.value || events.value.length === 0) {
    return []
  }

  return events.value.map(event => ({
    id: event._id,
    title: event.title,
    description: event.description || 'No description',
    startDateFormatted: formatDate(event.startDate),
    endDateFormatted: formatDate(event.endDate),
    duration: calculateDuration(event.startDate, event.endDate),
    actions: event // Original event object for actions
  }))
})

// API calls
const fetchUser = async () => {
  try {
    clearErrors()
    const data = await getUserById(route.params.id)
    user.value = data.user
    events.value = data.events || []
  } catch (error) {
    setApiError(error)
    showErrorMessage(MESSAGES.ERROR.USER_FETCH_FAILED)
  }
}

const handleSort = (key, direction) => {
  // Sorting is handled by TableUniversal component
}

// Event handlers
const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) {
    editingEvent.value = null
  }
}

const closeModal = () => {
  showForm.value = false
  editingEvent.value = null
}

const editEvent = (event) => {
  editingEvent.value = event
  showForm.value = true
}

const deleteEvent = async (eventId) => {
  const confirmed = window.confirm(MESSAGES.CONFIRM.DELETE_EVENT)
  if (!confirmed) return

  try {
    await apiDeleteEvent(eventId)
    await fetchUser() // Refresh data
    showSuccessMessage(MESSAGES.SUCCESS.EVENT_DELETED)
  } catch (error) {
    setApiError(error)
    showErrorMessage(MESSAGES.ERROR.EVENT_DELETE_FAILED)
  }
}

const handleEventCreated = () => {
  showForm.value = false
  fetchUser()
  showSuccessMessage(MESSAGES.SUCCESS.EVENT_CREATED)
}

const handleEventUpdated = () => {
  showForm.value = false
  editingEvent.value = null
  fetchUser()
  showSuccessMessage(MESSAGES.SUCCESS.EVENT_UPDATED)
}

const handleFormCancel = () => {
  showForm.value = false
  editingEvent.value = null
}

// Lifecycle
onMounted(fetchUser)
</script>

<style scoped>
/* Page-specific styles only - common styles moved to globals.css */

/* Page-specific responsive overrides */
@media (max-width: 768px) {
  .user-profile-page {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
}
</style>
