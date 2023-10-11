<template>
    <q-layout view="hHh lpR fFf">
      <!-- Left Side Panel -->
      <q-drawer show-if-above v-model="leftDrawerOpen" side="left">
        <q-list>
          <q-item-label header>Private Chats</q-item-label>
          <!-- Loop through private chats and display them -->
          <q-item v-for="chat in privateChats" :key="chat.id" clickable @click="openChat(chat)">
            <q-item-section>{{ chat.name }}</q-item-section>
          </q-item>
  
          <q-item-label header>Groups</q-item-label>
          <!-- Loop through groups and display them -->
          <q-item v-for="group in groups" :key="group.id" clickable @click="openGroup(group)">
            <q-item-section>{{ group.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
  
      <!-- Chat Space -->
      <q-page-container v-if="currentChat">
        <!-- Display chat messages here -->
        <div v-for="message in currentChat.messages" :key="message.id">
          {{ message.content }}
        </div>
  
        <!-- Message input field -->
        <q-input v-model="messageInput" @keyup.enter="sendMessage" />
      </q-page-container>
  
      <!-- Right Side Panel -->
      <q-drawer show-if-above v-model="rightDrawerOpen" side="right">
        <!-- User search field -->
        <q-input v-model="userSearch" @keyup.enter="searchUser" />
  
        <!-- Display search results -->
        <div v-for="user in userSearchResults" :key="user.id">
          {{ user.name }}
          <!-- Show add friend button if not friends, else show cancel request button -->
          <q-btn v-if="!isFriend(user)" @click="sendFriendRequest(user)">Add Friend</q-btn>
          <q-btn v-else @click="cancelFriendRequest(user)">Cancel Request</q-btn>
        </div>
      </q-drawer>
    </q-layout>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const leftDrawerOpen = ref(false);
      const rightDrawerOpen = ref(false);
      const privateChats = ref([]);
      const groups = ref([]);
      const currentChat = ref(null);
      const messageInput = ref('');
      const userSearch = ref('');
      const userSearchResults = ref([]);
  
      // TODO: Implement methods to open chats/groups, send messages, search users, send/cancel friend requests
  
      return {
        leftDrawerOpen,
        rightDrawerOpen,
        privateChats,
        groups,
        currentChat,
        messageInput,
        userSearch,
        userSearchResults
      };
    }
  };
  </script>
  