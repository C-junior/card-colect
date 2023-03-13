
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
      <div @click="pegar">
      <h2>{{ message.cardName }}</h2>
      <br>
      <img :src="message.cardImgUrl" alt="card image">    
    </div>
        
     
    </div>
  </div>
    <br> <button @click="send"> Drop </button>
   
  </div>
</template>

<script>
import Navbar from './components/Login.vue';
import Card from './components/Card.vue';
import Inventory from './components/Inventory.vue';
import {  RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref, watch, nextTick } from 'vue'
  import { useAuth, useChat } from '@/firebase'
import { currentUser } from './firebase';

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
    const {  sendMessage, messagesRef, getCard} = useChat()
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
    const pegar = () => {
      getCard(InventoryItem.value)
    }
   

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

<style scoped>
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


header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

</style>
