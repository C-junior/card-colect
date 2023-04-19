
<template>
  <div>
    <div class="top-nav">
    <navbar />
    <div class="profile-btn" v-if="isLogin">  <h5> {{ user.displayName }}</h5>    
    </div> 
    </div>
    <img  class="dropbtn" src="../assets/btn.svg" alt="" @click="send">


    <br><br>
    <div class="card-container">
      
      <div v-for="(message, index) in messages" :key="index" class="card-row" :disabled="message.disabled" :class="{ 'disabled': message.disabled }">
        <div @click="pegar(message)" >
          <p class="cardname">{{ message.cardName }}</p>
          <br>
          <img v-if="message.rarity === 'legendary'" class="frame" src="../assets/frame-legendary.png " alt="">
          <img v-if="message.rarity === 'epic'" class="frame" src="../assets/frame-epics.png " alt="">
          <img v-if="message.rarity === 'super-rare'" class="frame" src="../assets/frame-super-rare.png " alt="">
          <img v-if="message.rarity === 'rare'" class="frame" src="../assets/frame-rare.png " alt="">
          <img v-if="message.rarity === 'uncommon'" class="frame" src="../assets/frame-uncommon.png " alt="">
          <img v-if="message.rarity === 'common'" class="frame" src="../assets/frame-common.png " alt="">
          <img :src="message.cardImg" alt="card image">
        </div>
      </div>
    </div>
    
 
  </div>
</template>

<script>
import Navbar from '../components/Login.vue';
import { ref, computed, watchEffect } from 'vue'
import { useAuth, useChat } from '@/firebase'



export default {
  components: {
    Navbar
  },
  setup() {
    // Initialize variables
    const { user, isLogin } = useAuth()
    const messages = ref([]);
    const { sendMessage, messagesRef, getCard,  inventoryRef } = useChat()
    const message = ref('')
    
    watchEffect(onInvalidate => {
      const unsubscribe = messagesRef.orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
        const newMessages = [];
        querySnapshot.forEach(doc => {
          newMessages.push(doc.data())
        });
        messages.value = newMessages.splice(0, 6);
      });

      onInvalidate(() => {
        // Unsubscribe from the listener when the component is unmounted
        unsubscribe();
      });
    });
  
    
    const pegar = async (message) => {
  // Check if the message has already been added to the inventory
  const inventorySnapshot = await inventoryRef.where('cardId', '==', message.cardId).get();
  if (inventorySnapshot.size > 0) {
    console.log('Message has already been added to the inventory.');
    return;
  }

  // Check if the message has been disabled for 1 minute or more
  if (message.createdAt && (new Date() - message.createdAt.toDate()) >= (1 * 20 * 1000)) {
    message.disabled = true;
  }

  // Disable the card if it hasn't already been disabled
  if (!message.disabled) {
    // Add the message to the inventory
   // await inventoryRef.add({ cardId: message.cardId });

    // Disable the card
    message.disabled = true;
    message.disabledAt = new Date(); // Add the disabledAt property to the message
    console.log("o valor é", await getCard(message));
  }
};
    
    // Send a message
    const send = async () => {
 
  await sendMessage(message.value);
  message.value = ''; // Clear the input field after sending
};

    
    // Retrieve the messages from Firestore
    messagesRef.orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
     const newMessages = [];
      querySnapshot.forEach(doc => {
        newMessages.push(doc.data())
      });    
      messages.value = newMessages.splice(0, 6);
    });
    
    
  
    return { user, isLogin, messages,  message, send , pegar,  inventoryRef };
  }
}
</script>

<style scoped>
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
  display: block;
  text-align: center;
  width: 250px;
  margin-left: 20px;
  margin-bottom: 20px;
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