<template>
  <main>
    <div class="container" v-if="user">
      <div class="back-button">
        <router-link to="/" class="btn btn-back">
          ← Back to Users
        </router-link>
      </div>

      <div class="profile-header">
        <div class="user-info">
          <h1 class="user-name">👤 {{ user.firstName }} {{ user.lastName }}</h1>
        </div>

        <button class="btn btn-primary" @click="showForm = !showForm">
          {{ showForm ? '✕ Cancel' : '📅 Create Event' }}
        </button>
      </div>

    <!-- Two-column layout when form is shown -->
    <div class="content-layout" :class="{ 'form-visible': showForm }">
      <div class="header-compact" :class="{ 'narrow': showForm }">
        <h3 class="compact-title">👤 User Information</h3>
        <div class="user-info-compact">
          <div class="info-item">
            <span class="info-icon">📧</span>
            <span>{{ user.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">📞</span>
            <span>{{ user.phoneNumber }}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">📅</span>
            <span>{{ events.length }} event(s)</span>
          </div>
        </div>
      </div>

      <transition name="slide-fade">
        <div v-if="showForm" class="form-container">
          <EventForm :userId="user._id" @created="fetchUser" />
        </div>
      </transition>
    </div>

    <div class="events-section">
      <h2 class="section-title">📅 User Events</h2>

      <div v-if="events.length === 0" class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No Events Yet</h3>
        <p>This user hasn't created any events. Click "Create Event" to add the first one!</p>
      </div>

      <div v-else class="table-container">
        <table class="modern-table">
          <thead>
            <tr>
              <th>📝 Title</th>
              <th>📄 Description</th>
              <th>🕐 Start</th>
              <th>🕐 End</th>
              <th>⏱️ Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event._id">
              <td class="title-cell">{{ event.title }}</td>
              <td class="description-cell">{{ event.description || '-' }}</td>
              <td class="date-cell">{{ formatDate(event.startDate) }}</td>
              <td class="date-cell">{{ formatDate(event.endDate) }}</td>
              <td class="duration-cell">{{ calculateDuration(event.startDate, event.endDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import EventForm from '../components/EventForm.vue';

const route = useRoute();
const user = ref(null);
const events = ref([]);
const showForm = ref(false);

const fetchUser = async () => {
  const res = await axios.get(`http://localhost:5000/api/users/${route.params.id}`);
  user.value = res.data.user;
  events.value = res.data.events;
};

const formatDate = (d) => d ? new Date(d).toLocaleString() : '-';

const calculateDuration = (start, end) => {
  if (!start || !end) return '-';
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate - startDate;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
};

onMounted(fetchUser);
</script>

<style scoped>
main {
  background: #0f0f23;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  box-sizing: border-box;
}

.container {
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.back-button {
  margin-bottom: 1rem;
}

.btn-back {
  background: #374151;
  color: #e5e7eb;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-back:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  width: 100%;
}

.user-info {
  flex: 1;
}

.user-name {
  margin: 0 0 1rem 0;
  font-size: 2.25rem;
  font-weight: 700;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
}

.detail-icon {
  font-size: 1.25rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.content-layout {
  display: flex;
  gap: 2rem;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.content-layout:not(.form-visible) {
  justify-content: center;
}

.header-compact {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #333366;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 2;
  max-width: 100%;
  transform: translateY(0);
}

.header-compact:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
}

.header-compact.narrow {
  flex: 1;
  max-width: 35%;
  transform: scale(0.95);
}

.compact-title {
  margin: 0 0 1.5rem 0;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
}

.user-info-compact {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.4s ease;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #16213e;
  border-radius: 8px;
  border: 1px solid #333366;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.info-item:hover {
  transform: translateX(10px);
  background: #1a1a2e;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

.info-item:nth-child(1) {
  animation-delay: 0.1s;
}

.info-item:nth-child(2) {
  animation-delay: 0.2s;
}

.info-item:nth-child(3) {
  animation-delay: 0.3s;
}

.info-icon {
  font-size: 1.25rem;
  min-width: 24px;
}

.form-container {
  padding: 1.5rem;
  background: #1a1a2e;
  border-radius: 12px;
  border: 1px solid #333366;
  flex: 3;
  animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.form-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.15);
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateX(50px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.events-section {
  background: #16213e;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border: 1px solid #333366;
  width: 100%;
}

.section-title {
  margin: 0 0 1.5rem 0;
  color: #ffffff;
  font-size: 1.75rem;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #e2e8f0;
  font-size: 1.25rem;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

.table-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #333366;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  background: #16213e;
}

.modern-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modern-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
}

.modern-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #333366;
  vertical-align: middle;
  color: #e2e8f0;
}

.modern-table tbody tr {
  transition: background-color 0.2s ease;
}

.modern-table tbody tr:hover {
  background-color: #1a1a2e;
}

.modern-table tbody tr:last-child td {
  border-bottom: none;
}

.title-cell {
  font-weight: 600;
  color: #ffffff;
}

.description-cell {
  color: #9ca3af;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-cell {
  font-size: 0.875rem;
  color: #d1d5db;
}

.duration-cell {
  font-weight: 500;
  color: #10b981;
  background: #064e3b;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  display: inline-block;
  text-align: center;
  min-width: 60px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .back-button {
    margin-bottom: 0.5rem;
  }

  .profile-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    padding: 1.5rem;
  }

  .user-name {
    font-size: 1.75rem;
  }

  .content-layout {
    flex-direction: column;
    gap: 1rem;
  }

  .header-compact.narrow {
    max-width: 100%;
  }

  .form-container {
    padding: 1rem;
  }

  .modern-table {
    font-size: 0.75rem;
  }

  .modern-table th,
  .modern-table td {
    padding: 0.5rem;
  }

  .description-cell {
    max-width: 100px;
  }
}
</style>
