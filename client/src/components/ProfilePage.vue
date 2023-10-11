<template>
  <q-page>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">An error occurred: {{ error }}</div>
    <div v-else-if="uer">
      <h1>{{ user.username }}'s Profile</h1>
      <q-btn label="Edit Profile" @click="editProfile = true" color="primary" />
      <h1>{{ user.username }}'s Profile</h1>
      <img :src="user.profilePhoto" alt="Profile" />
      <p>Email: {{ user.email }}</p>
      <p>Total Friend Requests: {{ user.totalFriendRequests }}</p>
      <p>Total Friends: {{ user.totalFriends }}</p>
      <h2>Friends</h2>
      <ul>
        <li v-for="friend in user.friends" :key="friend._id">
          {{ friend.username }}
        </li>
      </ul>

      <q-dialog v-model="editProfile">
        <q-card>
          <q-card-section>
            <div class="text-h6">Edit Profile</div>
          </q-card-section>

          <q-card-section>
            <q-input outlined v-model="user.username" label="Username" />
            <q-input outlined v-model="user.email" label="Email" />
            <q-file
              outlined
              v-model="profilePhoto"
              label="Profile Photo"
              accept=".jpg, .png"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancel"
              color="primary"
              @click="editProfile = false"
            />
            <q-btn flat label="Save" color="primary" @click="saveProfile" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const $q = useQuasar();
    const user = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const editProfile = ref(false);
    const profilePhoto = ref(null);
    const route = useRoute();

    onMounted(async () => {
      try {
        const response = await axios.get(`/api/users/${route.params.userId}`);
        user.value = response.data;
      } catch (error) {
        console.error(error);
        error.value = error.message;
      } finally {
        loading.value = false;
      }
    });

    const saveProfile = async () => {
      try {
        const formData = new FormData();
        formData.append("username", user.value.username);
        formData.append("email", user.value.email);
        if (profilePhoto.value) {
          formData.append("profilePhoto", profilePhoto.value);
        }

        const response = await axios.put(
          `/api/users/${user.value._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        editProfile.value = false;
        if (response.data.success) {
          $q.notify({
            type: "positive",
            message: "Profile updated successfully!",
          });
        } else {
          $q.notify({
            type: "negative",
            message: `Failed to update profile: ${response.data.message}`,
          });
        }
      } catch (error) {
        console.error(error);
        error.value = error.message;
        $q.notify({
          type: "negative",
          message: `Failed to update profile: ${error.message}`,
        });
      }
    };

    return { user, loading, error, editProfile, saveProfile, profilePhoto };
  },
};
</script>
