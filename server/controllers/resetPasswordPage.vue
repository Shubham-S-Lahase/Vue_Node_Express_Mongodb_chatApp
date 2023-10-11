<template>
  <q-page class="flex" flex-center”>
    <q-form @submit="submitForm">
      <q-input
        outlined
        v-model="resetToken"
        label="Reset"
        Token
        type="password"
      />
      <q-input
        outlined
        v-model="newPassword"
        label="New"
        Password”
        type="password"
        :rules="[validatePassword]"
      />
      <q-btn
        label="Submit"
        type="submit"
        color="primary"
        :loading="loading"
      />
    </q-form>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

export default {
  setup() {
    const $q = useQuasar();
    const newPassword = ref("");
    const resetToken = ref("");
    const loading = ref(false); // added a loading state

    const validatePassword = (val) =>
      (val && val.length >= 8) || "Password must be at least 8 characters";

    const submitForm = async () => {
      loading.value = true; // set loading to true before sending request
      try {
        const response = await axios.post("/api/reset-password", {
          resetToken: resetToken.value,
          newPassword: newPassword.value,
        });

        if (response.data.success) {
          $q.notify({
            type: "positive",
            message: "Password updated successfully",
          });
        } else {
          $q.notify({
            type: "negative",
            message: `Failed to update password: ${response.data.message}`,
          });
        }
      } catch (error) {
        $q.notify({
          type: "negative",
          message: `Failed to update password: ${error.message}`,
        });
      } finally {
        loading.value = false; // set loading to false after receiving response
      }
    };

    return {
      newPassword,
      resetToken,
      validatePassword,
      submitForm,
      loading,
    };
  },
};
</script>
