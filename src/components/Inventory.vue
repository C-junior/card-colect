<template>
    <div>
      <h1>Inventory</h1>
      <div v-for="card in inventory" :key="card">
        <h2>{{ cards[card].title }}</h2>
        <img :src="cards[card].image" :alt="cards[card].title" />
        <p>{{ cards[card].description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { firestore, currentUser } from '@/firebase';
  
  export default {
    setup() {
      const inventory = ref([]);
  
      firestore
        .collection('inventory')
        .doc(currentUser.value.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            inventory.value = doc.data().items;
          } else {
            inventory.value = [];
          }
        });
  
      const cards = {
        1: {
          id: '1',
          title: 'Card 1',
          image: 'https://placekitten.com/200/300',
          description: 'This is the first card.',
        },
        2: {
          id: '2',
          title: 'Card 2',
          image: 'https://placekitten.com/200/300',
          description: 'This is the second card.',
        },
        3: {
          id: '3',
          title: 'Card 3',
          image: 'https://placekitten.com/200/300',
          description: 'This is the third card.',
        },
      };
  
      return {
        inventory,
        cards,
      };
    },
  };
  </script>
  