<template>
  <div class="form-wrapper">
    <h3 class="form-title">📅 Create New Event</h3>
    <form @submit.prevent="createEvent" class="modern-form">
      <div class="input-group">
        <label for="title">Event Title</label>
        <input
          id="title"
          v-model="form.title"
          placeholder="Enter event title"
          required
          class="form-input"
        />
      </div>

      <div class="input-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Enter event description"
          class="form-textarea"
          rows="3"
        />
      </div>

      <div class="datetime-grid">
        <div class="input-group">
          <label for="startDate">Start Date & Time</label>
          <input
            id="startDate"
            type="datetime-local"
            v-model="form.startDate"
            required
            class="form-input datetime-input"
          />
        </div>

        <div class="input-group">
          <label for="endDate">End Date & Time</label>
          <input
            id="endDate"
            type="datetime-local"
            v-model="form.endDate"
            required
            class="form-input datetime-input"
          />
        </div>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? '⏳ Saving...' : '✓ Save Event' }}
      </button>

      <div v-if="successMsg" class="success-message">
        ✅ {{ successMsg }}
      </div>

      <div v-if="errorMsg" class="error-message">
        ⚠️ {{ errorMsg }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
const props = defineProps({ userId: String });
const emit = defineEmits(['created']);

const form = reactive({
  title: '',
  description: '',
  startDate: '',
  endDate: ''
});
const errorMsg = ref('');
const successMsg = ref('');
const isSubmitting = ref(false);

const createEvent = async () => {
  try {
    // Clear previous messages
    errorMsg.value = '';
    successMsg.value = '';
    isSubmitting.value = true;

    // Validate dates
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      errorMsg.value = 'End date must be after start date';
      return;
    }

    // Check if start date is in the past
    if (new Date(form.startDate) < new Date()) {
      errorMsg.value = 'Start date cannot be in the past';
      return;
    }

    await axios.post(`http://localhost:5000/api/events/${props.userId}`, form);
    Object.assign(form, { title: '', description: '', startDate: '', endDate: '' });
    successMsg.value = 'Event created successfully!';

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMsg.value = '';
    }, 3000);

    emit('created');
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'Something went wrong';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.form-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.form-title {
  margin: 0 0 1.5rem 0;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.modern-form {
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border: 1px solid #333366;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.input-group label {
  margin-bottom: 0.5rem;
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #333366;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #0f0f23;
  color: #ffffff;
}

.form-textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #333366;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #0f0f23;
  color: #ffffff;
  resize: vertical;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: #16213e;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #6b7280;
}

.datetime-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.datetime-input {
  font-family: inherit;
}

.datetime-input::-webkit-calendar-picker-indicator {
  background-color: #667eea;
  border-radius: 3px;
  cursor: pointer;
}

.btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(16, 185, 129, 0.35);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);
}

.success-message {
  background: #1f2937;
  border: 1px solid #10b981;
  color: #6ee7b7;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.error-message {
  background: #2d1b1b;
  border: 1px solid #dc2626;
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .datetime-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .modern-form {
    padding: 1.5rem;
  }
}
</style>
