<template>
  <div class="form-wrapper">
    <h3 class="form-title">👤 Create New User</h3>
    <form @submit.prevent="createUser" class="modern-form">
      <div class="form-grid">
        <div class="input-group">
          <label for="firstName">First Name</label>
          <input
            id="firstName"
            v-model="form.firstName"
            placeholder="Enter first name"
            required
            class="form-input"
          />
        </div>

        <div class="input-group">
          <label for="lastName">Last Name</label>
          <input
            id="lastName"
            v-model="form.lastName"
            placeholder="Enter last name"
            required
            class="form-input"
          />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter email address"
            required
            class="form-input"
          />
        </div>

        <div class="input-group">
          <label for="phone">Phone Number</label>
          <input
            id="phone"
            v-model="form.phoneNumber"
            placeholder="Enter phone number"
            required
            class="form-input"
          />
        </div>
      </div>

      <button type="submit" class="btn btn-primary">
        ✓ Save User
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import axios from 'axios';
const emit = defineEmits(['created']);

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
});

const createUser = async () => {
  await axios.post('http://localhost:5000/api/users', form);
  Object.assign(form, { firstName: '', lastName: '', email: '', phoneNumber: '' });
  emit('created');
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
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

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: #16213e;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #6b7280;
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
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(102, 126, 234, 0.35);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .modern-form {
    padding: 1.5rem;
  }
}
</style>
