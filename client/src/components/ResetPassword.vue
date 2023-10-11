<template>
    <q-page>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <h1>Reset Password</h1>
        <q-input outlined v-model="newPassword" label="New Password" type="password" />
        <q-btn label="Submit" @click="resetPassword" color="primary" />
      </div>
    </q-page>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useRoute } from "vue-router";
  import axios from "axios";
  
  export default {
    setup() {
      const newPassword = ref("");
      const loading = ref(false);
      const error = ref(null);
      const route = useRoute();
  
      const resetPassword = async () => {
        try {
          loading.value = true;
          await axios.post(`/api/users/reset-password`, {
            resetToken: route.query.resetToken,
            newPassword: newPassword.value
          });
          error.value = null;
          loading.value = false;
        } catch (err) {
          console.error(err);
          error.value = err.message;
          loading.value = false;
        }
      };
  
      return { newPassword, loading, error, resetPassword };
    },
  };
  </script>