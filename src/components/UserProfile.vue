<template>
    <div class="profile-container">
      <div v-if="isLogin" class="user-profile">
        <img :src="user.photoURL" class="profile-picture" alt="perfil">
        <h2 class="profile-name">{{ user.displayName }}</h2>
      </div>
     
      <div class="profile-stats">
        <div class="stat-item">
          <img src="../assets/logo.svg" alt="send-count-icon" class="stat-icon">
          <p class="stat-text">Send Count: {{ sendCount }}</p>
        </div>
        <div class="stat-item">
          <img src="../assets/logo.svg" alt="get-count-icon" class="stat-icon">
          <p class="stat-text">Get Count: {{ getCount }}</p>
        </div>
        <div class="stat-item">
          <img src="../assets/coin.png" alt="gold-icon" class="stat-icon">
          <p class="stat-text">Gold: {{ gold }}</p>
        </div>
      </div>
    </div>
  </template>
  <script>
  import Navbar from '../components/Login.vue';
  import { useAuth } from '@/firebase.js';
  import { ref, watchEffect } from 'vue';
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  
  export default {
    components: {
      Navbar
    },
    name: 'Profile',
    setup() {
      const { user, isLogin } = useAuth();
      const sendCount = ref(0);
      const getCount = ref(0);
      const gold = ref(0);
  
      watchEffect(() => {
        if (user.value) {
          // Retrieve send count, get count, and gold from Firestore
          const db = firebase.firestore();
          const userRef = db.collection('userProfiles').doc(user.value.uid);
          userRef.get().then((doc) => {
            const userData = doc.data();
            sendCount.value = userData.sendCount || 0;
            getCount.value = userData.getCount || 0;
            gold.value = userData.gold || 0;
          }).catch((error) => {
            console.error('Error retrieving user data: ', error);
          });
        }
      });
  
      return { user, sendCount, getCount, gold, isLogin };
    }
  }
  </script>
  <style scoped>
  .profile-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border: 2px solid #ccc;
    border-radius: 10px;
    background-color: rgb(73, 18, 18);
  }
  
  .user-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .profile-picture {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  
  .profile-name {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .profile-stats {
    display: flex;
    gap: 1rem;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .stat-icon {
    width: 25px;
  }
  
  .stat-text {
    font-size: 1rem;
    font-weight: bold;
  }
  </style>