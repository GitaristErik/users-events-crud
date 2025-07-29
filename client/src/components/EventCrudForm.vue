<template>
  <div class="event-form card card--glass">
    <div class="form-header">
      <h3 class="form-title">
        <span class="title-icon">{{ editingEvent ? '✏️' : '📅' }}</span>
        {{ editingEvent ? 'Edit Event' : 'Create New Event' }}
      </h3>
      <button type="button" @click="cancelForm" class="btn btn--icon btn--ghost close-btn">
        <span>✕</span>
      </button>
    </div>

    <form @submit.prevent="submitEvent" class="event-form-content">
      <!-- Error Messages -->
      <div v-if="hasErrors" class="message error">
        <div class="error-main">{{ formattedErrors }}</div>
        <ul v-if="errors.length > 0" class="error-details">
          <li v-for="error in errors" :key="error.field || error.message">
            {{ error.field ? `${error.field}: ${error.message}` : error.message }}
          </li>
        </ul>
      </div>

      <!-- Success Message -->
      <div v-if="successMsg" class="message success">{{ successMsg }}</div>

      <!-- Title Row -->
      <div class="form-group">
        <label for="title" class="form-label">
          📝 Event Title *
        </label>
        <input
          id="title"
          v-model="form.title"
          placeholder="Enter event title"
          required
          :class="getFieldClass('title')"
          @blur="v$.value.title.$touch()"
        />
        <div v-if="isFieldInvalid('title')" class="field-error">
          {{ getFieldError('title') }}
        </div>
      </div>

      <!-- User Assignment Row -->
      <div class="form-group">
        <label for="userId" class="form-label">
          👤 Assign to User *
        </label>
        <select
          id="userId"
          v-model="form.userId"
          required
          :class="getFieldClass('userId')"
          @blur="v$.value.userId.$touch()"
        >
          <option value="" disabled>Select a user</option>
          <option v-for="user in users" :key="user._id" :value="user._id">
            {{ user.firstName }} {{ user.lastName }}
          </option>
        </select>
        <div v-if="isFieldInvalid('userId')" class="field-error">
          {{ getFieldError('userId') }}
        </div>
      </div>

      <!-- Description Row -->
      <div class="form-group">
        <label for="description" class="form-label">
          📋 Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Event description (optional)"
          rows="3"
          class="form-textarea"
          :class="{ 'form-input--error': isFieldInvalid('description') }"
        ></textarea>
        <div v-if="isFieldInvalid('description')" class="field-error">
          {{ getFieldError('description') }}
        </div>
        <div class="field-hint">Maximum 500 characters</div>
      </div>

      <!-- Date & Time Row -->
      <div class="form-group-row">
        <div class="form-group">
          <label for="startDate" class="form-label">
            🗓️ Start Date & Time *
          </label>
          <input
            id="startDate"
            v-model="form.startDate"
            type="datetime-local"
            class="form-input"
            required
            :class="{ 'form-input--error': isFieldInvalid('startDate') }"
          />
          <div v-if="isFieldInvalid('startDate')" class="field-error">
            {{ getFieldError('startDate') }}
          </div>
        </div>

        <div class="form-group">
          <label for="endDate" class="form-label">
            🏁 End Date & Time *
          </label>
          <input
            id="endDate"
            v-model="form.endDate"
            type="datetime-local"
            class="form-input"
            required
            :class="{ 'form-input--error': isFieldInvalid('endDate') }"
          />
          <div v-if="isFieldInvalid('endDate')" class="field-error">
            {{ getFieldError('endDate') }}
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="submit" class="btn btn--primary btn--lg" :disabled="isSubmitting">
          <span>{{ isSubmitting ? '⏳' : (editingEvent ? '✓' : '✓') }}</span>
          {{ isSubmitting ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event') }}
        </button>

        <button type="button" @click="cancelForm" class="btn btn--secondary btn--lg">
          <span>✕</span>
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useErrorHandling } from '@/composables/useErrorHandling'
import { useEventValidation } from '@/composables/useValidation'

const props = defineProps({
  users: Array,
  editingEvent: Object,
  defaultUserId: String
})

const emit = defineEmits(['created', 'updated', 'cancelled'])

// Form reactive object
const form = reactive({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  userId: ''
})

// Composables
const { createEvent, updateEvent } = useApi()
const { errors, errorMessage, hasErrors, formattedErrors, setApiError, clearErrors } = useErrorHandling()
const { v$, getErrorMessage, getFieldClass, getFieldError, isFieldValid, isFieldInvalid, isFormValid } = useEventValidation(form)

const successMsg = ref('')
const isSubmitting = ref(false)

// Functions
const formatDateForInput = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const resetForm = () => {
  Object.assign(form, {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    userId: props.defaultUserId || ''
  })
  clearErrors()
  successMsg.value = ''
}

// Fill form when editing
watch(() => props.editingEvent, (newEvent) => {
  if (newEvent) {
    form.title = newEvent.title || ''
    form.description = newEvent.description || ''
    form.startDate = newEvent.startDate ? formatDateForInput(newEvent.startDate) : ''
    form.endDate = newEvent.endDate ? formatDateForInput(newEvent.endDate) : ''

    if (newEvent.userId) {
      if (typeof newEvent.userId === 'object' && newEvent.userId._id) {
        form.userId = newEvent.userId._id
      } else if (typeof newEvent.userId === 'string') {
        form.userId = newEvent.userId
      }
    } else {
      form.userId = ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const submitEvent = async () => {
  try {
    clearErrors()
    successMsg.value = ''
    isSubmitting.value = true

    // Validate form
    v$.value.$touch()
    if (!isFormValid.value) {
      // Collect errors for display
      const errorList = Object.keys(form).map(field => ({ field, message: getFieldError(field) })).filter(e => e.message)
      setApiError({ message: 'Please fix the following errors:', details: errorList })
      return
    }

    if (props.editingEvent) {
      await updateEvent(props.editingEvent._id, form)
      successMsg.value = 'Event updated successfully!'

      setTimeout(() => {
        emit('updated')
      }, 1500)
    } else {
      await createEvent(form)
      successMsg.value = 'Event created successfully!'

      setTimeout(() => {
        emit('created')
      }, 1500)
    }

    resetForm()
  } catch (error) {
    setApiError(error)
  } finally {
    isSubmitting.value = false
  }
}

const cancelForm = () => {
  resetForm()
  emit('cancelled')
}

// Initialize form with default user
onMounted(() => {
  if (!props.editingEvent && props.defaultUserId) {
    form.userId = props.defaultUserId
  }
})
</script>

<style scoped>
.event-form {
  padding: var(--spacing-2xl);
  max-width: 600px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-secondary);
}

.form-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.close-btn {
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: var(--text-primary);
}

.form-group {
  margin-bottom: var(--spacing-xl);
}

.form-group-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--surface-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-primary-alpha);
}

.form-input--error,
.form-select--error,
.form-textarea--error {
  border-color: var(--status-error);
  box-shadow: 0 0 0 3px var(--status-error-alpha);
}

.field-error {
  color: var(--status-error);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
}

.field-hint {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-secondary);
}

.message {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 4px solid;
}

.message.error {
  background: var(--status-error-bg);
  border-color: var(--status-error);
  color: var(--status-error-text);
}

.message.success {
  background: var(--status-success-bg);
  border-color: var(--status-success);
  color: var(--status-success-text);
}

.error-details {
  margin: var(--spacing-sm) 0 0 0;
  padding-left: var(--spacing-lg);
}

.error-details li {
  margin-bottom: var(--spacing-xs);
}

@media (max-width: 768px) {
  .form-group-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
