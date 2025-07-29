<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h3 class="form-title">{{ formTitle }}</h3>
      <div class="form-divider"></div>
    </div>

    <!-- Error Messages -->
    <div v-if="hasErrors" class="message error">
      <div class="error-main">{{ errorMessage || 'Please fix the following errors:' }}</div>
      <ul v-if="errors.length > 0" class="error-details">
        <li v-for="error in errors" :key="error.field || error.message">
          <strong>{{ error.field || 'Field' }}:</strong> {{ error.message }}
        </li>
      </ul>
    </div>

    <!-- Success Message -->
    <div v-if="successMsg" class="message success">{{ successMsg }}</div>

    <form @submit.prevent="submitHandler" class="modern-form">
      <div class="form-grid">
        <div class="input-group">
          <label for="firstName">First Name *</label>
          <input
            id="firstName"
            v-model="form.firstName"
            placeholder="Enter first name"
            required
            :class="getFieldClass('firstName')"
            @blur="v$.value.firstName.$touch()"
          />
          <div v-if="isFieldInvalid('firstName')" class="field-error">
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
            :class="getFieldClass('lastName')"
            @blur="v$.value.lastName.$touch()"
          />
          <div v-if="isFieldInvalid('lastName')" class="field-error">
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
            :class="getFieldClass('email')"
            @blur="v$.value.email.$touch()"
          />
          <div v-if="isFieldInvalid('email')" class="field-error">
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
            :class="getFieldClass('phoneNumber')"
            @blur="v$.value.phoneNumber.$touch()"
          />
          <div v-if="isFieldInvalid('phoneNumber')" class="field-error">
            {{ getFieldError('phoneNumber') }}
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn--primary" :disabled="isSubmitting">
          <span>{{ isSubmitting ? '⏳' : (isEditing ? '✏️' : '✓') }}</span>
          {{ isSubmitting ? (isEditing ? 'Updating...' : 'Saving...') : submitButtonText }}
        </button>

        <button type="button" class="btn btn--secondary" @click="emit('cancelled')" :disabled="isSubmitting">
          ✕ Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useErrorHandling } from '@/composables/useErrorHandling'
import { useSimpleUserValidation } from '@/composables/useValidation'

// Props
const props = defineProps({
  editingUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['created', 'updated', 'cancelled'])

// Form reactive object
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
})

// Composables
const { createUser: apiCreateUser, updateUser: apiUpdateUser } = useApi()
const { errors, errorMessage, hasErrors, formattedErrors, setApiError, clearErrors } = useErrorHandling()
const { v$, getErrorMessage, getFieldClass, getFieldError, isFieldValid, isFieldInvalid, isFormValid } = useSimpleUserValidation(form)

const successMsg = ref('')
const isSubmitting = ref(false)

// Functions
const resetForm = () => {
  Object.assign(form, { firstName: '', lastName: '', email: '', phoneNumber: '' })
  clearErrors()
  successMsg.value = ''
}

// Computed properties
const isEditing = computed(() => !!props.editingUser)
const formTitle = computed(() => isEditing.value ? '✏️ Edit User' : '👤 Create New User')
const submitButtonText = computed(() => isEditing.value ? 'Update User' : 'Save User')

// Watch for editing user changes
watch(() => props.editingUser, (newUser) => {
  if (newUser) {
    Object.assign(form, {
      firstName: newUser.firstName || '',
      lastName: newUser.lastName || '',
      email: newUser.email || '',
      phoneNumber: newUser.phoneNumber || ''
    })
  } else {
    resetForm()
  }
}, { immediate: true })

const submitHandler = async () => {
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

    if (isEditing.value) {
      await apiUpdateUser(props.editingUser._id, form)
      successMsg.value = 'User updated successfully!'

      setTimeout(() => {
        resetForm()
        emit('updated')
      }, 1500)
    } else {
      await apiCreateUser(form)
      successMsg.value = 'User created successfully!'

      setTimeout(() => {
        resetForm()
        emit('created')
      }, 1500)
    }

  } catch (error) {
    setApiError(error)
  } finally {
    isSubmitting.value = false
  }
}

// Aliases for template
const createUser = submitHandler
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

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.form-actions .btn {
  flex: 1;
}

@media (max-width: 768px) {
  .form-wrapper {
    margin: 0;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
