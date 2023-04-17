
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
      const fiveMinutesAgo = new Date(Date.now() - (2 * 10 * 1000));
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
    const grabInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
          const maxGrabCounts = 2;
          
          const grabCard = (userProfile) => {
            const now = new Date();
            const lastGrabTime = new Date(userProfile.lastGrabTime || 0);
            const elapsed = now - lastGrabTime;
            const remaining = grabInterval - elapsed;
          
            if (remaining > 0) {
              const remainingMinutes = Math.ceil(remaining / (60 * 1000));
              console.log(`Sorry, you need to wait ${remainingMinutes} more minute(s) to grab another card.`);
              return;
            }
          
            const grabCounts = userProfile.grabCounts || 0;
            if (grabCounts >= maxGrabCounts) {
              console.log(`Sorry, you can only keep up to ${maxGrabCounts} grab count(s). Please use some before grabbing more cards.`);
              return;
            }
          
            // Decrease grab count by 1 and update last grab time
            const newProfile = {
              ...userProfile,
              grabCounts: grabCounts + 1,
              lastGrabTime: now.getTime(),
            };
          
            // Use 1 grab count to get a card
            const card = getCard();
            if (card) {
              console.log(`You got a new card: ${card.cardName} (${card.rarity}).`);
              // Save the new inventory item and updated profile
              saveInventoryItem(card, newProfile);
            } else {
              console.log(`Sorry, there was an error getting the card.`);
            }
          };
          
          const saveInventoryItem = (card, userProfile) => {
            // Save the inventory item with the updated user profile
            const { photoURL, uid, displayName } = userProfile;
            const inventoryItem = {
              userName: displayName,
              userId: uid,
            //  userPhotoURL: photoURL,
              cardImg: card.cardImg,
              cardName: card.cardName,
              cardId: card.cardId,
              rarity: card.rarity,
              burngold: card.burngold,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };
            cardRef
              .add(inventoryItem)
              .then((docRef) => {
                console.log(`Inventory item written with ID: ${docRef.id}`);
                firestore.collection('userProfiles').doc(uid).set(userProfile);
              })
              .catch((error) => {
                console.error(`Error adding inventory item: ${error}`);
              });
          };
  
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