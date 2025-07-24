<template>
  <main>
    <div class="container">
      <div class="header">
        <h1>👥 Users Management</h1>
        <button class="btn btn-primary" @click="showForm = !showForm">
          {{ showForm ? '✕ Cancel' : '+ Create User' }}
        </button>
      </div>

      <div class="content-layout" :class="{ 'form-visible': showForm }">
        <div class="stats-card" :class="{ 'narrow': showForm }">
          <h3 class="card-title">📊 Statistics</h3>
          <div class="stats-grid">
            <div class="stat-wrapper">
              <div class="stat-item stat-users">
                <div class="stat-number">{{ users.length }}</div>
              </div>
              <div class="stat-label">👥 Total Users</div>
            </div>
            <div class="stat-wrapper">
              <div class="stat-item stat-active">
                <div class="stat-number">{{ usersWithEvents }}</div>
              </div>
              <div class="stat-label">🎯 Active Users</div>
            </div>
            <div class="stat-wrapper">
              <div class="stat-item stat-events">
                <div class="stat-number">{{ totalEvents }}</div>
              </div>
              <div class="stat-label">📅 Total Events</div>
            </div>
          </div>
        </div>

        <transition name="slide-fade">
          <div v-if="showForm" class="form-container">
            <UserForm @created="fetchUsers" />
          </div>
        </transition>
      </div>

      <div class="table-container">
        <table class="modern-table">
          <thead>
            <tr>
              <th>👤 User Name</th>
              <th>📧 Email</th>
              <th>📞 Phone</th>
              <th>📅 Events Count</th>
              <th>⏰ Next Event</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>
                <router-link :to="`/user/${user._id}`" class="user-link">
                  {{ user.firstName }} {{ user.lastName }}
                </router-link>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.phoneNumber }}</td>
              <td>
                <span class="badge" :class="user.eventsCount > 0 ? 'badge-success' : 'badge-secondary'">
                  {{ user.eventsCount }}
                </span>
              </td>
              <td>{{ formatDate(user.nextEventDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template><script setup>

import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import UserForm from '../components/UserForm.vue';

const users = ref([]);
const showForm = ref(false);

const fetchUsers = async () => {
  const res = await axios.get('http://localhost:5000/api/users');
  users.value = res.data;
};

const formatDate = (d) => d ? new Date(d).toLocaleString() : '-';

const usersWithEvents = computed(() => {
  return users.value.filter(user => user.eventsCount > 0).length;
});

const totalEvents = computed(() => {
  return users.value.reduce((total, user) => total + user.eventsCount, 0);
});

onMounted(fetchUsers);
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid #333366;
  width: 100%;
}

.header h1 {
  margin: 0;
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  animation: pulse 2s infinite;
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

.content-layout {
  display: flex;
  gap: 2rem;
  transition: all 0.3s ease;
  justify-content: center;
  width: 100%;
}

.stats-card {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #333366;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 2;
  max-width: 100%;
  transform: translateY(0);
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
}

.stats-card.narrow {
  flex: 1;
  max-width: 35%;
  transform: scale(0.95);
}

.card-title {
  margin: 0 0 1.5rem 0;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  justify-items: center;
  transition: all 0.4s ease;
}

.stats-card.narrow .stats-grid {
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.stat-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.stat-wrapper:nth-child(1) {
  animation-delay: 0.1s;
}

.stat-wrapper:nth-child(2) {
  animation-delay: 0.2s;
}

.stat-wrapper:nth-child(3) {
  animation-delay: 0.3s;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  border: 3px solid #333366;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-users {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.stat-active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
}

.stat-events {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-color: #f59e0b;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.stat-item:hover::before {
  transform: translateX(100%);
}

.stats-card.narrow .stat-item {
  width: 90px;
  height: 90px;
}

.stat-item:hover {
  transform: scale(1.15) rotate(10deg);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.5);
}

.stat-users:hover {
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.6);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.stat-active:hover {
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.6);
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.stat-events:hover {
  box-shadow: 0 20px 40px rgba(245, 158, 11, 0.6);
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
}

.stats-card.narrow .stat-item:hover {
  transform: scale(1.1) rotate(5deg);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.stats-card.narrow .stat-number {
  font-size: 2rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #e2e8f0;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  background: rgba(26, 26, 46, 0.8);
  border-radius: 20px;
  border: 1px solid #333366;
  backdrop-filter: blur(10px);
  min-width: 120px;
}

.stat-wrapper:hover .stat-label {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  transform: translateY(-3px);
}

.stats-card.narrow .stat-label {
  font-size: 0.75rem;
  min-width: 100px;
  padding: 0.4rem 0.8rem;
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

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  }
}

.table-container {
  background: #16213e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid #333366;
  width: 100%;
  animation: fadeInUp 0.8s ease-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;
  transition: all 0.3s ease;
}

.table-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
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

.user-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.user-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 2rem;
  height: 1.5rem;
}

.badge-success {
  background-color: #10b981;
  color: white;
}

.badge-secondary {
  background-color: #6b7280;
  color: white;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .content-layout {
    flex-direction: column;
    gap: 1rem;
  }

  .stats-card.narrow {
    max-width: 100%;
    transform: none;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .stat-item {
    width: 80px;
    height: 80px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.6rem;
  }

  .modern-table {
    font-size: 0.875rem;
  }

  .modern-table th,
  .modern-table td {
    padding: 0.75rem;
  }
}
</style>
