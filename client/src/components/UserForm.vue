<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h3 class="form-title">👤 Create New User</h3>
      <div class="form-divider"></div>
    </div>

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

    <form @submit.prevent="createUser" class="modern-form">
      <div class="form-grid">
        <div class="input-group">
          <label for="firstName">First Name *</label>
          <input
            id="firstName"
            v-model="form.firstName"
            placeholder="Enter first name"
            required
            class="form-input"
            :class="{ 'form-input--error': hasFieldError('firstName') }"
          />
          <div v-if="hasFieldError('firstName')" class="field-error">
            {{ getFieldError('firstName') }}
          </div>
        </div>

        <div class="input-group">
          <label for="lastName">Last Name *</label>
          <input
            id="lastName"
            v-model="form.lastName"
            placeholder="Enter last name"
            required
            class="form-input"
            :class="{ 'form-input--error': hasFieldError('lastName') }"
          />
          <div v-if="hasFieldError('lastName')" class="field-error">
            {{ getFieldError('lastName') }}
          </div>
        </div>

        <div class="input-group">
          <label for="email">Email *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter email address"
            required
            class="form-input"
            :class="{ 'form-input--error': hasFieldError('email') }"
          />
          <div v-if="hasFieldError('email')" class="field-error">
            {{ getFieldError('email') }}
          </div>
        </div>

        <div class="input-group">
          <label for="phone">Phone Number *</label>
          <input
            id="phone"
            v-model="form.phoneNumber"
            placeholder="Enter phone number"
            required
            class="form-input"
            :class="{ 'form-input--error': hasFieldError('phoneNumber') }"
          />
          <div v-if="hasFieldError('phoneNumber')" class="field-error">
            {{ getFieldError('phoneNumber') }}
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn--primary" :disabled="isSubmitting">
        <span>{{ isSubmitting ? '⏳' : '✓' }}</span>
        {{ isSubmitting ? 'Saving...' : 'Save User' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useErrorHandling } from '@/composables/useErrorHandling'
import { useFormValidation } from '@/composables/useFormValidation'

const emit = defineEmits(['created'])

// Composables
const { createUser: apiCreateUser } = useApi()
const { errors, errorMessage, hasErrors, formattedErrors, setApiError, clearErrors, getFieldError, hasFieldError } = useErrorHandling()
const { validateUser, isFormValid } = useFormValidation()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
})

const successMsg = ref('')
const isSubmitting = ref(false)

const resetForm = () => {
  Object.assign(form, { firstName: '', lastName: '', email: '', phoneNumber: '' })
  clearErrors()
  successMsg.value = ''
}

const createUserHandler = async () => {
  try {
    clearErrors()
    successMsg.value = ''
    isSubmitting.value = true

    // Validate form
    const validationErrors = validateUser(form)
    if (!isFormValid(validationErrors)) {
      const errorList = Object.entries(validationErrors).map(([field, message]) => ({ field, message }))
      setApiError({ message: 'Please fix the following errors:', details: errorList })
      return
    }

    await apiCreateUser(form)
    successMsg.value = 'User created successfully!'

    setTimeout(() => {
      resetForm()
      emit('created')
    }, 1500)

  } catch (error) {
    setApiError(error)
  } finally {
    isSubmitting.value = false
  }
}

// Alias for template
// Aliases
const createUser = createUserHandler
</script>

<style scoped>
.form-wrapper {
  margin: 0;
  width: 100%;
}

.form-input--error {
  border-color: var(--status-error);
  box-shadow: 0 0 0 3px var(--status-error-alpha);
}

.field-error {
  color: var(--status-error);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
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
  .form-wrapper {
    margin: 0;
  }
}
</style>
