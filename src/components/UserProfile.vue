<!-- <template>
    <div class="profile-container">
      <div v-if="isLogin" class="user-profile">
        <img :src="user.photoURL" class="profile-picture" alt="perfil">
        <h2 class="profile-name">{{ user.displayName }}</h2>
      </div>
     
      <div class="profile-stats">
        <div class="stat-item">
          <img src="../assets/logo.svg" alt="send-count-icon" class="stat-icon">
          <p class="stat-text">Drops: {{ sendCount }}</p>
        </div>
        <div class="stat-item">
          <img src="../assets/logo.svg" alt="get-count-icon" class="stat-icon">
          <p class="stat-text">Grabs: {{ getCount }}</p>
        </div>
        <div class="stat-item">
          <img src="../assets/coin.png" alt="gold-icon" class="stat-icon">
          <p class="stat-text">Gold: {{ gold }}</p>
        </div>
      </div>
    </div>
  </template> -->
  <template>
    <div class="container-profile">
   

    <div class="profile-card">
      <div v-if="isLogin" >
        <div class="">         
            <p class="card-name">{{ user.displayName }}</p><br>
            <img :src="user.photoURL" class="card-picture" alt="perfil">
        </div>
      </div>

<div class="card-details">
  <img src="../assets/detail.svg" />
  <img class="logo-card" src="../assets/logogg.png" />
  <div class="stats-player">
    <div class="stat-item">
          <img src="../assets/drop.svg" alt="send-count-icon" class="stat-svg">
          <p class="stat-text">{{ sendCount }}</p>
     </div>
     <div class="stat-item">
          <img src="../assets/grab.svg" alt="send-count-icon" class="stat-svg">
          <p class="stat-text"> {{ getCount }}</p>
        </div>
        <div class="stat-item">
            <img src="../assets/gold.svg" alt="gold-icon" class="stat-svg">
            <p class="stat-text"> {{ gold }}</p>
          </div>
        <div class="stat-item">
          <img src="../assets/gem.svg" alt="send-count-icon" class="stat-svg">
          <p class="stat-text"> {{ gems }}</p>
        </div>
    </div>
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
      const gems = ref(0);
  
      watchEffect(() => {
        if (user.value) {
          // Retrieve send count, get count, and gold from Firestore
          const db = firebase.firestore();
          const userRef = db.collection('userProfiles').doc(user.value.uid);
          userRef.get().then((doc) => {
            const userData = doc.data();
            sendCount.value = userData.sendCount || 0;
            getCount.value = userData.getCount || 0;
            gold.value = userData.burngold + userData.gold || 0;
            gems.value = userData.gems || 0;
          }).catch((error) => {
            console.error('Error retrieving user data: ', error);
          });
        }
      });
  
      return { user, sendCount, getCount, gold, isLogin, gems };
    }
  }
  </script>

<style scoped>

.profile-card{
  height: 484px;
  width: 260px;
  background-color: black;
  border: #691818 solid 10px;
  margin: auto;
  box-shadow: 1px 8px 6px 2px rgba(245, 244, 244, 0.733);
  border-radius: 45px;
}

.card-name{
  background-color: #b60c0c;
  padding: 2px 8px;
  margin: 8px auto;
  border-radius: 8px;
  text-align: center;
  width: fit-content;
}
.card-picture{
width: 240px;
position: relative;
top:-20px;
}
.stats-player{
  position: relative;
  top: -195px;
  left: 25px;
}

.card-details{
  /* Rectangle 11 */

position: absolute;
width: 246px;
height: 236px;
left: -15px;
top: 230px;


}

.logo-card{
  position: absolute;
  top:10px;
  left: calc(50% - 18px);
  width: 60px;
}
.profile-container {
  display: flex;
  width: fit-content;
  margin: auto;
  flex-direction: column;
  align-items: center;
  margin-top: 15%!important; 
  border: solid 2px white;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  animation: slide-up 0.5s ease-out;
}

.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #691818;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}

.profile-header {
  display: flex;
  align-items: center;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 20px;
}

.profile-name-container {
  display: flex;
  align-items: start;
}

.profile-name {
  font-size: 24px;
  margin: 0;
}

.profile-online-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
  margin-left: 10px;
}

.profile-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  border-top: 2px solid rgb(73, 3, 3);
  border-bottom: 2px solid  rgb(73, 3, 3);
  width: 90%;
}

.stat-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.stat-icon {
  width: 20px;
  margin-right: 10px;
}

.stat-text {
  font-family: 'Black Ops One', cursive;
  font-size: 16px;
  padding-left: 10px;
  padding-bottom: 8px;
  margin: 0;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
  <!-- <style scoped>
  .profile-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border: 2px solid #ccc;
    border-radius: 10px;
    background-color: rgb(73, 18, 18);
    margin-top: 46px;
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
  </style> -->

 <!-- 
  profile-funcional
 .profile-container {
    display: flex;
    width: fit-content;
    margin: auto;
    flex-direction: column;
    align-items: center;
    margin-top: 15%!important; 
    border: solid 2px white;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    overflow: hidden;
    animation: slide-up 0.5s ease-out;
  }
  
  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: #691818;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
  }
  
  .profile-picture {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 20px;
  }
  
  .profile-name-container {
    display: flex;
    align-items: center;
  }
  
  .profile-name {
    font-size: 24px;
    margin: 0;
  }
  
  .profile-online-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: green;
    margin-left: 10px;
  }
  
  .profile-stats {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-radius: 8px;
    border-top: 2px solid rgb(73, 3, 3);
    border-bottom: 2px solid  rgb(73, 3, 3);
    width: 90%;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .stat-icon {
    width: 20px;
    margin-right: 10px;
  }
  
  .stat-text {
    font-size: 16px;
    margin: 0;
  }
  
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
  
    to {
      opacity: 1;
      transform: translateY(0);
    }
  } -->