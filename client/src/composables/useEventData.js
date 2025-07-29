import { computed } from 'vue'
import { formatDate, formatTime, calculateDuration, isEventActive, isThisMonth } from '../utils/helpers'

export function useEventData(events, users) {
  /**
   * Transform events for table display
   */
  const tableEvents = computed(() => {
    if (!events.value || events.value.length === 0) {
      return []
    }

    const result = events.value.map(event => {
      // Process user data safely
      let userName = 'Unknown User'
      let userId = null

      if (event.userId) {
        if (typeof event.userId === 'object' && event.userId.firstName) {
          userName = `${event.userId.firstName} ${event.userId.lastName}`
          userId = event.userId._id
        } else {
          // If userId is just an ID, find user in users array
          const user = users.value.find(u => u._id === event.userId)
          if (user) {
            userName = `${user.firstName} ${user.lastName}`
            userId = user._id
          } else {
            userName = `User ID: ${event.userId}`
            userId = event.userId
          }
        }
      }

      const processedEvent = {
        id: event._id,
        title: event.title,
        user: userName,
        userId: userId,
        description: event.description || 'No description',
        startDateFormatted: formatDate(event.startDate),
        endDateFormatted: formatDate(event.endDate),
        duration: calculateDuration(event.startDate, event.endDate),
        actions: { ...event, userId: userId }
      }

      return processedEvent
    })

    return result
  })

  const uniqueUsersCount = computed(() => {
    const userIds = events.value.map(event => {
      if (typeof event.userId === 'object' && event.userId._id) {
        return event.userId._id
      }
      return event.userId
    }).filter(Boolean)
    return new Set(userIds).size
  })

  const thisMonthEvents = computed(() => {
    return events.value.filter(event => isThisMonth(event.startDate)).length
  })

  const activeEvents = computed(() => {
    return events.value.filter(event => isEventActive(event.endDate)).length
  })

  const statsData = computed(() => [
    {
      value: events.value.length,
      label: '📅 Total Events',
      color: '#667eea'
    },
    {
      value: activeEvents.value,
      label: '⏰ Active Events',
      color: '#10b981'
    },
    {
      value: thisMonthEvents.value,
      label: '📊 This Month',
      color: '#f59e0b'
    }
  ])

  return {
    tableEvents,
    uniqueUsersCount,
    thisMonthEvents,
    activeEvents,
    statsData
  }
}
