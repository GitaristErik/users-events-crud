<template>
  <div>
    <h1>Users</h1>
    <button @click="showForm = !showForm">Create User</button>
    <UserForm v-if="showForm" @created="fetchUsers" />
    <table>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Events Count</th>
          <th>Next Event</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>
            <router-link :to="`/user/${user._id}`">
              {{ user.firstName }} {{ user.lastName }}
            </router-link>
          </td>
          <td>{{ user.email }}</td>
          <td>{{ user.phoneNumber }}</td>
          <td>{{ user.eventsCount }}</td>
          <td>{{ formatDate(user.nextEventDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';
import UserForm from '../components/UserForm.vue';

const users = ref([]);
const showForm = ref(false);

const fetchUsers = async () => {
  const res = await axios.get('http://localhost:5000/api/users');
  users.value = res.data;
};

const formatDate = (d) => d ? new Date(d).toLocaleString() : '-';

onMounted(fetchUsers);
</script>
