<template>
  <div>
    <navbar />
    <div>
      <card v-for="card in cards" :key="card.id" :id="card.id" :title="card.title" :image="card.image" :description="card.description" />
    </div>
    <inventory />

    <div>
    <div v-for="(message, index) in messages" :key="index" class="card-row">
      <img :src="message.cardImgUrl" alt="card image">
      <div class="card-info">
        <h3>{{ message.cardName }}</h3>
        <p>{{ message.cardDescription }}</p>
      </div>
    </div>
  </div>
  </div>
    <div>
      <form v-if="isLogin" @submit.prevent="send">
      <input v-model="message" placeholder="Message" :disabled="true" />
      <button type="submit"><SendIcon/>Enviar</button>
    </form>
    </div>
</template>

<script>
import Navbar from '../components/Login.vue';
import Card from '../components/Card.vue';
import Inventory from '../components/Inventory.vue';
import { ref } from 'vue';
import { messagesRef } from '@/firebase';


export default {
  components: {
    Navbar,
    Card,
    Inventory,
  },
  data() {
    return {
      cards: [
        {
          id: '1',
          title: 'Card 1',
          image: 'https://placekitten.com/200/300',
          description: 'This is the first card.',
        },
        {
          id: '2',
          title: 'Card 2',
          image: 'https://placekitten.com/200/300',
          description: 'This is the second card.',
        },
        {
          id: '3',
          title: 'Card 3',
          image: 'https://placekitten.com/200/300',
          description: 'This is the third card.',
        },
      ],
    };
  },
};

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
