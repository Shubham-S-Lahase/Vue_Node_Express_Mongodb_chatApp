<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title style="text-align: center;"> Chat App (MEVN) </q-toolbar-title>

        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; color: yellow;">Made with passion<div style="color: rgb(0, 255, 251); font-weight:500; font-size: 16px; font-family:Verdana, Geneva, Tahoma, sans-serif; text-decoration: underline;">Shubham Lahase</div></div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-red-2">
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <q-item clickable tag="router-link" :to="{ path: '/home' }">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home Page</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="router-link" :to="{ path: '/profile' }">
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>My Profile</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="router-link" :to="{ path: '/' }">
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Login</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="router-link" :to="{ path: '/register' }">
          <q-item-section avatar>
            <q-icon name="how_to_reg" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Register</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://github.com/Shubham-S-Lahase/Vue_Node_Express_Mongodb_chatApp"
        >
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github Link</q-item-label>
            <q-item-label caption>To view full code</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
  name: "LayoutDefault",

  setup() {
    return {
      leftDrawerOpen: ref(false),
    };
  },
};
</script>