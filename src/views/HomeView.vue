
<template>
  <div>
    <navbar />
    <div v-if="isLogin"> <img :src="user.photoURL" width="20" alt="perfil"> {{ user.displayName }}
      <br><br>

        <div>
           <!-- <p> Parabens!! Voce pegou a carta ( {{ messages[0].cardId}} )  {{ messages[0].cardName}}</p> -->
        </div>
      <br><br>
    </div>
    <br> <button @click="send" > Drop </button> 
    <br><br>
    <div class="card-container">
      
      <div v-for="(message, index) in messages" :key="index" class="card-row" :disabled="message.disabled" :class="{ 'disabled': message.disabled }">
        <div @click="pegar(message)" >
          <p class="cardname">{{ message.cardName }}</p>
          <br>
          <img class="frame" src="../assets/frame.png " alt="">
          <img :src="message.cardImg" alt="card image">
        </div>
      </div>
    </div>
    
 
  </div>
</template>

<script>
import Navbar from '../components/Login.vue';
import { ref, computed, watch } from 'vue'
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
    
    // Disable the button for 3 minutes after a click
  
    
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
      const fiveMinutesAgo = new Date(Date.now() - (1 * 10 * 1000));
  const userMessagesQuery = messagesRef.where('userId', '==', user.value.uid);
  const recentMessages = await userMessagesQuery
    .where('createdAt', '>', fiveMinutesAgo)
    .limit(3)
    .get();

  // Check if the user has sent more than 3 messages within the last 5 minutes
  if (recentMessages.size >= 3) {
    console.log('You have sent too many messages. Please wait before sending another message. ', fiveMinutesAgo);
    return;
  }
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
.card-container{
  margin: auto;
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
  border-radius: 12px;
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
    height: 126px !important;
  }
}

.card-row img{
 width: 200px;
 height: 281px;
}

.frame{
  position: absolute;
  filter: hue-rotate(180deg);

  z-index: 10;
}
.cardname{
position: absolute;
z-index: 11;
bottom: 0px;
left: 50%;
transform: translate(-50%, -50%);
text-align: center;
color: black;
text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
/* background: rgb(2,0,36);
background: linear-gradient(0deg, rgb(47, 109, 138) 0%, rgba(45,45,50,1) 63%, rgba(0,212,255,0.15449929971988796) 100%);
width: 200px; */
}
.disabled {
  filter: grayscale(100%);
  background-color: aliceblue;
}
</style>