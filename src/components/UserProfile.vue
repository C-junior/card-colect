
  <template>
    
  <div class="container-profile ">
    <div class="special">
    <div class="profile-card ">
      <div v-if="isLogin" >
        <div class="">         
            <p class="card-name">{{ user.displayName }}</p><br>
            <img :src="user.photoURL" class="card-picture" alt="">
        </div>
      </div>

    <img class="card-img-profile" src="../assets/profile-card.svg" alt="">

    <div class="card-details">  
  <div class="stats-player">
    <div class="stat-item">
        <p class="stat-text">Dropadas</p>
          <p class="stat-text">{{ sendCount }}</p>
     </div>
     <div class="stat-item">
      <p class="stat-text">Obitidas</p>
          <p class="stat-text"> {{ getCount }}</p>
        </div>
        <div class="stat-item">
          <p class="stat-text">Ouro</p>
            <p class="stat-text"> {{ gold }}</p>
          </div>
        <div class="stat-item">
          <p class="stat-text">Gemas</p>
          <p class="stat-text"> {{ gems }}</p>
        </div>
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

.card-img-profile{
position: absolute;
top: 1px;
width: 360px;
z-index: -1;
}
.profile-card{
  height: 640px;
  width: 360px;
  margin: auto; 
  border-radius: 40px;
}

.card-name{
  font-weight: 900;
  position: relative;
  top: 20px;
  margin: 8px auto;
  border-radius: 8px;
  text-align: center;
  width: fit-content;
}
.card-picture{
border-radius: 50%;
width: 120px;
position: absolute;
top:169px;
left:127px;
}
.stats-player{
  position: relative;
  top: -195px;
  left: 25px;
}

.card-details{ 
position: absolute;
top: 532px;
}

.special {
  position: relative;
  overflow: hidden; 
  width: 370px;
  height: 604px;
  border-radius: 20px; 
  margin: auto;
  z-index: -1;
}

.special:before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  transform: rotate(45deg);
  z-index: -1;
  background: linear-gradient(to right, #f8a170, #ffcd75, #490303, #490303, #72a6ff, #bea410, #bea410,#af1d1d,#6e0808);
  background-size: 300% 300%;
  animation: gradientAnimation 2s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}  rotate animation 

.profile-container {
  position: relative;
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
  border-bottom: 2px solid  #490303;
  width: 90%;
}

.stat-item {
  display: flex;
  align-items: center;
  margin-left: 28px;
  margin-top: 12px;
}

.stat-icon {
  width: 20px;
  margin-right: 10px;
}

.stat-text {
  font-family: 'Black Ops One', cursive;
  font-size: 16px;
  padding-left: 10px;
  padding-bottom: 14px;
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