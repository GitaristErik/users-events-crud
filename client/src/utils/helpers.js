/**
 * Утилітні функції для роботи з датами та форматуванням
 */

/**
 * Форматувати дату в читабельний формат
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-'

  const date = new Date(dateString)

  const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  return date.toLocaleDateString('en-US', dateOptions)
}

/**
 * Форматувати час
 */
export const formatTime = (dateString) => {
  if (!dateString) return '-'

  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

/**
 * Обчислити тривалість між двома датами
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '-'

  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)

  // Обчислити часові одиниці
  const totalMinutes = Math.floor(diffTime / (1000 * 60))
  const totalHours = Math.floor(diffTime / (1000 * 60 * 60))
  const totalDays = Math.floor(totalHours / 24)

  // Менше години - показати тільки хвилини
  if (totalHours === 0) {
    return `${totalMinutes} хв`
  }

  // Менше дня - показати години та хвилини
  if (totalDays === 0) {
    const remainingMinutes = totalMinutes % 60
    if (remainingMinutes === 0) {
      return `${totalHours} год`
    }
    return `${totalHours} год ${remainingMinutes} хв`
  }

  // 1 день або більше - показати дні та години
  const remainingHours = totalHours % 24

  if (remainingHours === 0) {
    return totalDays === 1 ? '1 день' : `${totalDays} днів`
  }

  const daysText = totalDays === 1 ? '1 день' : `${totalDays} днів`
  const hoursText = remainingHours === 1 ? '1 год' : `${remainingHours} год`

  return `${daysText} ${hoursText}`
}

/**
 * Перевірити чи подія активна (не закінчилась)
 */
export const isEventActive = (endDate) => {
  if (!endDate) return false
  return new Date(endDate) > new Date()
}

/**
 * Перевірити чи подія цього місяця
 */
export const isThisMonth = (startDate) => {
  if (!startDate) return false

  const now = new Date()
  const eventDate = new Date(startDate)

  return eventDate.getMonth() === now.getMonth() &&
         eventDate.getFullYear() === now.getFullYear()
}

/**
 * Створити повідомлення про успіх
 */
export const showSuccessMessage = (message, duration = 3000) => {
  const successMsg = document.createElement('div')
  successMsg.textContent = message
  successMsg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `
  document.body.appendChild(successMsg)

  setTimeout(() => {
    if (document.body.contains(successMsg)) {
      document.body.removeChild(successMsg)
    }
  }, duration)
}

/**
 * Створити повідомлення про помилку
 */
export const showErrorMessage = (message, duration = 3000) => {
  const errorMsg = document.createElement('div')
  errorMsg.textContent = message
  errorMsg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `
  document.body.appendChild(errorMsg)

  setTimeout(() => {
    if (document.body.contains(errorMsg)) {
      document.body.removeChild(errorMsg)
    }
  }, duration)
}
