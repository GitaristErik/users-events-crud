<template>
  <main class="page-container">
    <div class="content-wrapper">
      <PageHeader
        title="📅 Events Dashboard"
        subtitle="Manage and track all events"
      >
        <template #actions>
          <button class="btn btn--primary" @click="toggleModal">
            {{ showModal ? '✕ Cancel' : '+ Create Event' }}
          </button>
        </template>
      </PageHeader>

      <!-- Modal for Event Creation/Editing -->
      <transition name="modal-fade">
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <EventCrudForm
              :users="users"
              :editing-event="editingEvent"
              @created="handleEventCreated"
              @updated="handleEventUpdated"
              @cancelled="handleFormCancel"
            />
          </div>
        </div>
      </transition>

      <!-- Stats Card -->
      <StatsCard
        title="📊 Statistics"
        :stats="statsData"
      />

      <!-- Events Table Section -->
      <TableUniversal
        title="📅 All Events"
        :data="tableEvents"
        :columns="eventsColumns"
        search-placeholder="🔍 Search events..."
        empty-icon="📅"
        empty-title="No Events Found"
        empty-message="Start by creating your first event!"
        default-sort="startDateFormatted"
        default-direction="asc"
        @sort="handleSort"
      >
        <!-- User Column Template with clickable links -->
        <template #cell-user="{ item }">
          <router-link v-if="item.userId" :to="`/user/${item.userId}`" class="user-link">
            {{ item.user }}
          </router-link>
          <span v-else class="text-secondary">{{ item.user }}</span>
        </template>

        <!-- Start Date Column Template -->
        <template #cell-startDateFormatted="{ item }">
          <div class="table-cell-date">
            <div class="table-cell-date__main">{{ formatDate(item.actions.startDate) }}</div>
            <div class="table-cell-date__time">{{ formatTime(item.actions.startDate) }}</div>
          </div>
        </template>

        <!-- End Date Column Template -->
        <template #cell-endDateFormatted="{ item }">
          <div class="table-cell-date">
            <div class="table-cell-date__main">{{ formatDate(item.actions.endDate) }}</div>
            <div class="table-cell-date__time">{{ formatTime(item.actions.endDate) }}</div>
          </div>
        </template>

        <!-- Actions Column Template -->
        <template #cell-actions="{ item }">
          <div class="table-cell-actions">
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
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import StatsCard from '../components/StatsCard.vue'
import TableUniversal from '../components/TableUniversal.vue'
import EventCrudForm from '../components/EventCrudForm.vue'
import { useApi } from '../composables/useApi'
import { useEventData } from '../composables/useEventData'
import { useModal } from '../composables/useModal'
import { formatDate, formatTime, showSuccessMessage, showErrorMessage } from '../utils/helpers'
import { EVENTS_TABLE_COLUMNS, MESSAGES } from '../constants'

// Reactive state
const events = ref([])
const users = ref([])
const editingEvent = ref(null)

// Composables
const { fetchEvents: apiFetchEvents, fetchUsers: apiFetchUsers, deleteEvent: apiDeleteEvent, loading } = useApi()
const { tableEvents, statsData } = useEventData(events, users)
const { showModal, openModal, closeModal, toggleModal } = useModal()

// API Methods
const fetchEvents = async () => {
  const data = await apiFetchEvents()
  events.value = data
}

const fetchUsers = async () => {
  const data = await apiFetchUsers()
  users.value = data
}

// Table Configuration
const eventsColumns = EVENTS_TABLE_COLUMNS

// Event handlers
const editEvent = (event) => {
  editingEvent.value = event
  openModal()
}

const deleteEvent = async (eventId) => {
  const confirmed = window.confirm(MESSAGES.CONFIRM.DELETE_EVENT)
  if (!confirmed) return

  try {
    await apiDeleteEvent(eventId)
    await fetchEvents() // Refresh data
    showSuccessMessage(MESSAGES.SUCCESS.EVENT_DELETED)
  } catch (error) {
    showErrorMessage(MESSAGES.ERROR.EVENT_DELETE_FAILED)
  }
}

const handleEventCreated = () => {
  closeModal()
  fetchEvents()
  showSuccessMessage(MESSAGES.SUCCESS.EVENT_CREATED)
}

const handleEventUpdated = () => {
  closeModal()
  editingEvent.value = null
  fetchEvents()
  showSuccessMessage(MESSAGES.SUCCESS.EVENT_UPDATED)
}

const handleFormCancel = () => {
  closeModal()
  editingEvent.value = null
}

const handleSort = (key, direction) => {
  // Sorting is handled by TableUniversal component
}

// Lifecycle
onMounted(async () => {
  await fetchUsers()
  await fetchEvents()
})
</script>

<style scoped>
/* Page-specific styles only - common styles moved to globals.css */

/* Custom hover effects for this page */
.table-cell-actions .btn:hover {
  transform: translateY(-1px) scale(1.05);
}
</style>
