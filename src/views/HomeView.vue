<template>
  <div>
    <div class="top-nav">
      <navbar />
      <div class="profile-btn" v-if="isLogin">
        <h5>{{ user.displayName }}</h5>
      </div>
    </div>
    <img v-if="dropbtnEnabled" class="dropbtn" :class="{ 'enabled': dropbtnEnabled }" src="../assets/btn.svg" alt="" @click="send">
    <p v-if="!dropbtnEnabled" class="loading-text">Waiting for data to be set...</p>

    <br>
    <!-- <div class="obtained-card" v-for="(card, index) in obtainedCards" :key="index">
    <p>Player: {{ card.playerName }}</p>
    <p>Card: {{ card.cardName }}</p>
  </div> -->
    <br>
    <div class="card-container">
      <div v-for="(message, index) in messages" :key="index" class="card-row" :disabled="message.disabled" :class="{ 'disabled': message.disabled }">
        <div @click="pegar(message)">
          <p class="cardname">{{ message.cardName }}</p>
          <br>
          <img v-if="message.rarity === 'legendary'" class="frame" src="../assets/frame-legendary.png" alt="">
          <img v-if="message.rarity === 'epic'" class="frame" src="../assets/frame-epics.png" alt="">
          <img v-if="message.rarity === 'super-rare'" class="frame" src="../assets/frame-super-rare.png" alt="">
          <img v-if="message.rarity === 'rare'" class="frame" src="../assets/frame-rare.png" alt="">
          <img v-if="message.rarity === 'uncommon'" class="frame" src="../assets/frame-uncommon.png" alt="">
          <img v-if="message.rarity === 'common'" class="frame" src="../assets/frame-common.png" alt="">
          <img :src="message.cardImg" alt="card image">         
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Login.vue';
import { ref, onBeforeUnmount, computed } from 'vue';
import { useAuth, useChat } from '@/firebase';
import { useStore } from '../store';

export default {
  components: {
    Navbar
  },
  setup() {
    const { user, isLogin } = useAuth();
    const { sendMessage, messagesRef, getCard, inventoryRef } = useChat();
    const message = ref('');
    const dropbtnEnabled = ref(false);
    let loadingTimeout;

    const store = useStore();
    const obtainedCards = computed(() => store.obtainedCards);

    loadingTimeout = setTimeout(() => {
      dropbtnEnabled.value = true;
    }, 2500);

    onBeforeUnmount(() => {
      clearTimeout(loadingTimeout);
    });

    const pegar = async (message) => {
      const inventorySnapshot = await inventoryRef.where('cardId', '==', message.cardId).get();
      if (inventorySnapshot.size > 0) {
        console.log('Message has already been added to the inventory.');
        return;
      }

      if (message.createdAt && (new Date() - message.createdAt.toDate()) >= (1 * 20 * 1000)) {
        message.disabled = true;
      }

      if (!message.disabled) {
        message.disabled = true;
        message.disabledAt = new Date();

        const card = await getCard(message);
       
        // store.addObtainedCard({
        //   playerName: message.playerName,
        //   cardName: message.cardName
        
        // });

      }
    };

    const send = async () => {
      await sendMessage(message.value);
      message.value = '';
    };

    const messages = ref([]);

    const unsubscribe = messagesRef.orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
      const newMessages = [];
      querySnapshot.forEach(doc => {
        newMessages.push(doc.data());
      });
      messages.value.splice(0, messages.value.length, ...newMessages.splice(0, 12));
    });

    onBeforeUnmount(() => {
      unsubscribe();
    });

    return {
      user,
      isLogin,
      messages,
      message,
      send,
      pegar,
      dropbtnEnabled,
      obtainedCards,
      store,
    };
  },
};
</script>

<style scoped>
.legenda{
  color: #191919;
}

.obtained-card {
  padding: 2px;
  margin:auto;
}

.dropbtn.enabled {
 filter: hue-rotate(120);
 cursor: pointer;
}

.loading-text {
  color: gray;
  font-style: italic;
  text-align: center;
  margin-top: 10px;
}
.top-nav {
  display: inline-flex;
  flex-direction: row-reverse;
  place-items: center;
  place-content: center;
  width: 100%;  
}
.top-nav h5{
  text-align: center;
  margin: auto;
  padding-left: 1px;
}

.card-container{
  margin: auto !important;
  width: 90%;
  max-width: 850px;
  display: flex;
  flex-wrap: wrap;
  place-items: center;
}
.card-row {
  margin: auto;
  display: block;
  text-align: center;
  width: 250px;
  overflow:hidden;
}
@media (max-width: 769px) {
  .card-row {
    width: calc(33.33% - 20px);
    margin-left: 20px;
    margin-bottom: 20px;
  }
}

@media (max-width: 426px) {
  .card-row {
    width: 90px;
    margin-left: 10px;
  }

  .card-row img {
    width: 90px !important;
    height: 155px !important;
  }
}

.card-row img{
 width: 200px;
 height: 345.45px;
}

.frame{
  position: absolute;
  filter: hue-rotate(0deg);
  z-index: 10;
}
.cardname{
position: absolute;
font-size: 0.7rem;
z-index: 11;
bottom: -25px;
left: 50%;
transform: translate(-50%, -50%);
text-align: center;
color: white;
padding: 5px;
 background: rgb(2,0,36);
 background: linear-gradient(360deg, #191919 -42.86%, rgba(28, 27, 27, 0.753) 85.25%, rgba(29, 29, 29, 0) 146.43%);
width: 200px; 
}
.disabled {
  filter: grayscale(100%);
  background-color: aliceblue;
}
.dropbtn{
  margin: auto;
  display: block;
  height: 46px !important;
}
.profile-btn{
  width: 90%;
  display: flex;
  justify-content: flex-end;  
  flex-direction: column;
  align-items: flex-end; 
}

.profile-btn img{
  border-radius: 50%;
  width: 50px;
  height: 50px;
 margin-right: 35px;
}


</style>