/**
 * Константи для конфігурації таблиці подій
 */
export const EVENTS_TABLE_COLUMNS = [
  { field: 'title', label: '📝 Title', sortable: true },
  { field: 'user', label: '👤 User', sortable: true },
  { field: 'description', label: '📋 Description', sortable: false },
  { field: 'startDateFormatted', label: '🚀 Start Date', sortable: true },
  { field: 'endDateFormatted', label: '🏁 End Date', sortable: true },
  { field: 'duration', label: '⏱️ Duration', sortable: true },
  { field: 'actions', label: '⚙️ Actions', sortable: false }
]

/**
 * Константи для повідомлень
 */
export const MESSAGES = {
  SUCCESS: {
    EVENT_CREATED: '✅ Event created successfully!',
    EVENT_UPDATED: '✅ Event updated successfully!',
    EVENT_DELETED: '✅ Event deleted successfully!'
  },
  ERROR: {
    EVENT_DELETE_FAILED: '❌ Error deleting event. Please try again.',
    FETCH_FAILED: '❌ Failed to fetch data. Please try again.',
    USERS_FETCH_FAILED: '❌ Failed to fetch users. Please try again.'
  },
  CONFIRM: {
    DELETE_EVENT: '⚠️ Are you sure you want to delete this event?\n\nThis action cannot be undone.'
  }
}

/**
 * Константи для API
 */
export const API_ENDPOINTS = {
  EVENTS: '/events',
  USERS: '/users'
}
