<template>
  <q-page
    class="flex flex-center"
    style="
      background-image: url('https://www.powertecsolutions.net/wp-content/uploads/2019/05/form-background.png');
      background-size: cover;
    "
  >
    <q-form @submit="submitForm" class="form">
      <q-input
        v-model="email"
        label="Email"
        :rules="[validateRequired, validateEmail]"
        color="green"
        clearable
      />
      <q-input
        v-model="password"
        label="Password"
        type="password"
        :rules="[validateRequired, validatePassword]"
        color="green"
        clearable
      />
      <q-btn label="Login" type="submit" color="primary" />
      <q-btn
        label="Forgot Password?"
        @click="forgotPassword"
        flat
        color="primary"
      />
    </q-form>
    <q-dialog v-model="forgotPasswordDialog">
      <q-card style="width: 50%; max-width: 400px; margin:auto;">
        <q-card-section>
          <div class="text-h6">Forgot Password</div>
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            v-model="forgotPasswordEmail"
            label="Email"
            :rules="[validateRequired, validateEmail]"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Submit"
            color="primary"
            @click="submitForgotPassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.form {
  width: 38%;
  padding: 3%;
  background-color: transparent;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.form input {
  margin-bottom: 2%;
}

.form button {
  margin-top: 2%;
  margin-bottom: 2%;
}
</style>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

export default {
  setup() {
    const $q = useQuasar();
    const email = ref("");
    const password = ref("");
    const forgotPasswordDialog = ref(false);
    const forgotPasswordEmail = ref("");

    const validateRequired = (val) =>
      (val && val.length > 0) || "Field is required";
    const validateEmail = (val) =>
      /\S+@\S+\.\S+/.test(val) || "Email must be valid";
    const validatePassword = (val) =>
      (val && val.length >= 8) || "Password must be at least 8 characters";

    const submitForm = async () => {
      try {
        const response = await axios.post("/api/login", {
          email: email.value,
          password: password.value,
        });

        if (response.data.success) {
          $q.notify({
            type: "positive",
            message: "Login successful!",
          });
          // Handle the response (e.g., save the token and user ID)
        } else {
          $q.notify({
            type: "negative",
            message: `Login failed: ${response.data.message}`,
          });
        }
      } catch (error) {
        $q.notify({
          type: "negative",
          message: `Login failed: ${error.message}`,
        });
      }
    };

    const forgotPassword = () => {
      forgotPasswordDialog.value = true;
    };

    const submitForgotPassword = async () => {
      // Handle forgot password form submission here
      try {
        const response = await axios.post("/api/forgot-password", {
          email: forgotPasswordEmail.value,
        });

        if (response.data.success) {
          $q.notify({
            type: "positive",
            message: "Reset link sent to your email",
          });
        } else {
          $q.notify({
            type: "negative",
            message: `Failed to send reset link: ${response.data.message}`,
          });
        }
      } catch (error) {
        $q.notify({
          type: "negative",
          message: `Failed to send reset link: ${error.message}`,
        });
      }
      forgotPasswordDialog.value = false;
    };

    return {
      email,
      password,
      forgotPasswordDialog,
      validateEmail,
      validatePassword,
      validateRequired,
      submitForm,
      forgotPassword,
      submitForgotPassword,
    };
  },
};
</script>
