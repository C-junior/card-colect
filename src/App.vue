<template>
  <header class="main-header">
    <div class="logo-container">
      <img src="./assets/logogg.png" alt="Company Logo">
      <h1>Gatcha <br> Game</h1>
    </div>
    <div class="profile-button"></div>
    <div class="profile-button2"></div>
  </header>
  <div class="nav-border"></div>
  <div v-if="!isMobile()">
    <div class="nav-links">
      <router-link to="/" @click="reloadPage()">Home</router-link> |
      <router-link to="/about">Inventory</router-link> |
      <router-link to="/marketplace">Card Market</router-link> |
      <router-link to="/shopgoods">Item Shop</router-link> |
      <router-link to="/rankingplayer">Ranking</router-link> |
      <router-link to="/profile">Profile</router-link>
    </div>
  </div>
  <div v-else>
    <div class="nav-links-mobile">
      <router-link to="/"><img src="./assets/home-icon.svg" alt=""></router-link>
      <router-link to="/about"><img src="./assets/backpack-icon.svg" alt=""></router-link>
      <router-link to="/marketplace"><img src="./assets/market-icon.svg" alt=""></router-link>
      <router-link to="/shopgoods"> <img src="./assets/shop.svg" alt=""></router-link>
      <router-link to="/rankingplayer"><img src="./assets/ranking.svg" alt=""></router-link>
      <router-link to="/profile"><img src="./assets/profile-icon.svg" alt=""></router-link>
    </div>
  </div>
  <router-view />
</template>

<script>
import HomeView from './views/HomeView.vue';
import { RouterView } from 'vue-router';

export default {
  components: {
    HomeView
  },
  methods: {
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
    reloadPage() {
      window.location.reload();
    }
  }
}
</script>


<style scoped>

.nav-links-mobile {
  z-index: 999;
  position: fixed;
  margin: auto;
  width: 100%;
  bottom: 0px;
    display: flex;
    justify-content: center;
    align-self: center;
    align-items: center;
    margin-top: 20px;
    background-color:#860E0E;
    border-radius: 12px 12px 0 0;
    padding: 5px;    
    border-top: #c0bfbf solid 3px;
  }

  .nav-links-mobile img {
    height: 36px;
    color:white;
  }
  
  .nav-links-mobile a {
    display: inline-flex;
   
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;
    margin: 0 5px;
    font-size: 24px;
    color: #000;
    background-color: rgb(20, 20, 20);
    border-radius: 12%;
  }

  .nav-links-mobile a:focus{
    background-color: #999292;
  }

  .nav-links-mobile a.router-link-exact-active {
  background-color: #928a8a
}



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
