<template>
  <q-page class="flex flex-center" style="background-image: url('https://c4.wallpaperflare.com/wallpaper/752/194/470/circles-highlights-background-form-wallpaper-preview.jpg'); background-size: cover;">
    <q-form @submit="submitForm" class="form">
      <q-input
        v-model="username"
        label="Username"
        :rules="[validateRequired, validateUsername]"
        color="green"
        clearable
      />
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
      <q-file
        outlined
        v-model="profilePhoto"
        label="Upload your Smiling Photo... 😉"
        accept=".jpg, .png"
        :rules="[validateRequired]"
        color="green"
        clearable
      />
      <q-btn label="Register" type="submit" color="primary" />
    </q-form>
  </q-page>
</template>

<style scoped>
.form {
  width: 300px;
  padding: 20px;
  background-color: transparent;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.form input {
  margin-bottom: 20px;
}

.form input:focus {
    border: none;
    outline: none;
}

.form button {
  margin-top: 20px;
}
</style>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

export default {
  setup() {
    const $q = useQuasar();
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const profilePhoto = ref(null);

    const validateRequired = (val) =>
      (val && val.length > 0) || "Field is required";
    const validateUsername = (val) =>
      (val && val.length >= 3) || "Username must be at least 3 characters";
    const validateEmail = (val) =>
      /\S+@\S+\.\S+/.test(val) || "Email must be valid";
    const validatePassword = (val) =>
      (val && val.length >= 8) || "Password must be at least 8 characters";

    const submitForm = async () => {
      try {
        const formData = new FormData();
        formData.append("username", username.value);
        formData.append("email", email.value);
        formData.append("password", password.value);
        formData.append("profilePhoto", profilePhoto.value);

        const response = await axios.post("/api/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          $q.notify({
            type: "positive",
            message: "Registration successful!",
          });
          // Handle the response (e.g., save the token and user ID)
        } else {
          $q.notify({
            type: "negative",
            message: `Registration failed: ${response.data.message}`,
          });
        }
      } catch (error) {
        $q.notify({
          type: "negative",
          message: `Registration failed: ${error.message}`,
        });
      }
    };

    return {
      username,
      email,
      password,
      profilePhoto,
      validateUsername,
      validateEmail,
      validatePassword,
      validateRequired,
      submitForm,
    };
  },
};
</script>
