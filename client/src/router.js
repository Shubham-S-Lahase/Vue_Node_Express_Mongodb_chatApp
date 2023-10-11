import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue'
import RegisterPage from './components/RegisterPage.vue';
import LoginPage from './components/LoginPage.vue';
import ProfilePage from './components/ProfilePage.vue';
import ResetPassword from './components/ResetPassword.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/home', component: HomePage },
  { path: '/profile', component: ProfilePage },
  { path: '/reset-password', component: ResetPassword }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;