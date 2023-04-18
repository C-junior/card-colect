<template>
    <div class="shop-container">
      <h1 class="shop-title">Shop</h1>
      <div v-for="item in items" :key="item.id" class="item-container">
        <img src="../assets/file-plus.svg" alt=""> <div class="item-name">{{ item.name }}</div>
        <div class="item-description">{{ item.description }}</div>
        <div class="item-price">{{ item.price }}</div>
        <button @click="buyItem(item)" class="buy-button">Buy</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import { useAuth } from '@/firebase.js';
  
  export default {
    name: 'ShopView',
    setup() {
      const { user } = useAuth();
      const items = ref([
      { id: 1, name: 'Extra Grab', description: 'Get an extra grab', price: 100 }
    ])
  
      const buyItem = async () => {
        if (!user.value) {
          console.log('User not logged in');
          return;
        }
  
        const db = firebase.firestore();
        const userProfileRef = db.collection('userProfiles').doc(user.value.uid);
        const userProfile = await userProfileRef.get();
        const gold = userProfile.get('gold');
  
        if (gold < 100) {
          console.log('User does not have enough gold to buy Extra Grab');
          return;
        }
  
        await userProfileRef.update({
          gold: gold - 100,
          extraGrabCount: (userProfile.get('extraGrabCount') || 0) + 1
        });
  
        console.log('Extra Grab purchased successfully');
      };
  
      return {
      items,
      buyItem
    }
    }
  };
  </script>
  
  <style scoped>
.shop-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: black;
}

.shop-title {
  color: red;
  font-size: 24px;
  margin-bottom: 20px;
}

.item-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #1c1c1c;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 350px;
}

.item-name {
  color: red;
  font-size: 18px;
  margin-bottom: 10px;
}

.item-description {
  color: white;
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
}

.item-price {
  color: red;
  font-size: 16px;
  margin-bottom: 10px;
}

.buy-button {
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.buy-button:hover {
  background-color: #b30000;
}
@media (min-width: 576px) {
  .item-container {
    width: 50%;
    max-width: none;
  }
}
</style>