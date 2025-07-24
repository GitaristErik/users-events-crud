<template>
  <form @submit.prevent="createUser">
    <input v-model="form.firstName" placeholder="First name" required />
    <input v-model="form.lastName" placeholder="Last name" required />
    <input v-model="form.email" placeholder="Email" required />
    <input v-model="form.phoneNumber" placeholder="Phone" required />
    <button type="submit">Save</button>
  </form>
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
