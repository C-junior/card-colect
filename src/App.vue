<template>
  <div class="nav-links">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">Inventory</router-link> |
    <router-link to="/profile">Profile</router-link>
  </div>
  <router-view/>
</template>

<script>
import HomeView from './views/HomeView.vue';
import {  RouterView } from 'vue-router'

export default{
  components:{
    HomeView
  }
}
</script>

<style scoped>


.logo {
  display: block;
  margin: 0 auto 2rem;
}

.nav-links {
  width: 100%;
  font-size: 12px;
  text-align: center;
  position: relative;
  top: 0;
  z-index: 999;
  margin: auto;

}

.nav-links a.router-link-exact-active {
  color: var(--color-text);
}

.nav-links a.router-link-exact-active:hover {
  background-color: transparent;
}

.nav-links a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

.nav-links a:first-of-type {
  border: 0;
}
</style>
