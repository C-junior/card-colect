<template>
<header class="main-header">
  <div class="logo-container">
    <img src="./assets/logogg.png" alt="Company Logo">
    <h1>Gatcha <br> Game</h1>
  </div>
  <!-- <img class="logocenter" src="./assets/logogg.png" alt="Company Logo"> -->
  <div class="profile-button"></div>
  <div class="profile-button2"></div>


</header>
<div class="nav-border"></div>
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


.logocenter {
  display: block;
  position: relative;
  top: 65px;
  margin: 0 2rem;
  height: 200px;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(211, 7, 7, 0.425);
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-container img {
  width: 50px;
  height: 50px;
}

.logo-container h1 {
  font-size: 24px;
  margin-left: 10px;
  line-height: 26px;
  color: #c0bfbf;
}

.profile-button {
/* Rectangle 17 */
position: relative;
width: 20%;
height: 80px;
border-bottom: 80px solid #860E0E;
border-left: 60px solid transparent; 
top: 0px;
right: -20px;
z-index: 1;

}
.profile-button2 {
/* Rectangle 17 */
position: absolute;
width: 20.5%;
height: 80px;
border-bottom: 80px solid #e7e3e3;
border-left: 60px solid transparent; 
z-index: 0;
top: 0px;
right: 0px;

}



.nav-links {
  width: 80%;
  font-size: 12px;
  text-align: center;
  position: relative;
  top: 0;
  z-index: 9;
  margin: auto;
  background-color: #e7e3e3;
  margin-bottom: 25px;
  
}
.nav-border {
  width: 81%;
  margin: auto;
  border-top: 18px solid #e7e3e3;
  border-left: 7px solid transparent; 
  border-right: 7px solid transparent; 
}
.nav-links a.router-link-exact-active {
  color: rgb(44, 1, 1)
}

.nav-links a.router-link-exact-active:hover {
  background-color: transparent;
}

.nav-links a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  color: #ac0606;
  font-family: 'Black Ops One', cursive;
  font-size: 1rem;
}

.nav-links a:first-of-type {
  border: 0;
}
</style>
