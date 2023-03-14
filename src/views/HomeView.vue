
<template>
  <div>
    <navbar />
   
    <div v-if="isLogin"> {{ user.displayName }}
      <br><br>
      <!-- <card  @click="send" v-for="card in cards" :key="card.id" :id="card.id" :title="card.title" :image="card.image" :description="card.description" /> -->
     
    </div>
  
    <!-- <inventory /> -->
    <div class="card-container">
      <div v-for="(message, index) in messages" :key="index" class="card-row">
  <div @click="pegar(message)">
    <h2>{{ message.cardName }}</h2>
    <br>
    <img :src="message.cardImg" alt="card image">    
  </div>
</div>
  </div>
    <br> <button @click="send"> Drop </button>
   
  </div>
</template>

<script>
import Navbar from '../components/Login.vue';
import Card from '../components/Card.vue';
import Inventory from '../components/Inventory.vue';
import HelloWorld from '../components/HelloWorld.vue'
import { ref, watch, nextTick } from 'vue'
  import { useAuth, useChat } from '@/firebase'
import { currentUser } from '@/firebase';

export default {
  components: {
    Navbar,
    Card,
    Inventory,
  },
  data() {
    return {
   
    };
  },
  setup() {
    const { user, isLogin } = useAuth()
    const messages = ref([]);
    const {  sendMessage, messagesRef, getCard } = useChat()
    const bottom = ref(null)
    watch(
      messages,
      () => {
        nextTick(() => {
          bottom.value?.scrollIntoView({ behavior: 'smooth' })
        })
      },
      { deep: true }
    )
    const message = ref('')
    const send = () => {
      sendMessage(message.value)
    }
    const pegar = async (message) => {
  const newDocId = await getCard(message);
  console.log("o valor é", newDocId);
};
   

    // Retrieve the messages from Firestore
   messagesRef.orderBy('createdAt').onSnapshot(querySnapshot => {
      messages.value = [];
      querySnapshot.forEach(doc => {
        messages.value.push(doc.data());
      });
    });

  
    return { user, isLogin, messages, bottom, message, send , pegar }
  }
}



</script>

<style>
.card-container{
  margin: auto;
  width: 680px;
  
  display: flex;
  flex-wrap: wrap;
}
.card-row {
  display: block;
  text-align: center;
  width: 200px;
  margin-left: 20px;
  margin-bottom: 20px;
  border: 3px red solid;
  border-radius: 12px;
  overflow:hidden;
}
.card-row img{
  width: 200px;
}
</style>