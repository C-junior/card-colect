<template>
    <div class="container-market">  
      <div class="coverbtn">
    <h1 class="title-page">MARKET</h1>
  </div>  
      <ul class="card-list">
        <li class="card-item" v-for="(item, index) in marketItems" :key="index">
          <div class="card-container">
            <img :src="item.cardImg" alt="card image">
            <p class="card-name">{{ item.cardName }}</p>
            <p class="card-price">{{ item.price }} {{ item.currency }}</p>
            <button @click="buyItem(item)">Buy</button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  
  export default {
    data() {
      return {
        marketItems: [],
      }
    },
    created() {
      const db = firebase.firestore();
      db.collection("market").orderBy("timestamp", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.marketItems.push({...doc.data(), id: doc.id}); // Include the document ID in the marketItems array
        });
      });
    },
    methods: {
      async buyItem(item) {
        const db = firebase.firestore();
        const user = firebase.auth().currentUser;
        const itemName = item.itemName;
        const price = item.price;
        const sellerId = item.userId;
        const sellerDoc = await db.collection("userProfiles").doc(sellerId).get();
        const seller = sellerDoc.data();
        if (seller.gold < price) {
          alert("You don't have enough gold to buy this item.");
          return;
        }
        if (!user) {
          alert("You must be logged in to buy items from the market.");
          return;
        }
        try {
          await db.collection("inventory").add({...item,
            userId: user.uid,
            cardId: item.id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          await db.collection("userProfiles").doc(user.uid).update({
            gold: firebase.firestore.FieldValue.increment(-price),
          });
          await db.collection("userProfiles").doc(sellerId).update({
            gold: firebase.firestore.FieldValue.increment(price),
          });
          await db.collection("market").doc(item.id).delete();
          alert(`You have purchased ${itemName} from ${seller.displayName} for ${price} gold.`);
        } catch (error) {
          console.error("Error buying item: ", error);
          alert("Failed to buy item. Please try again later.");
        }
      },
    },
  }
  </script>
  
  <style scoped>
  .container-market{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  }
  .coverbtn{  
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-image: url(../assets/coverbtn.svg);
  background-repeat: no-repeat;
  background-size: contain;
  padding: 18px 30px;
}
.title-page{
  position: relative;
  top:-12px;
  width: max-content;
  margin: 0 auto;
  color: #831714;
 }
  .market-items {
    margin-top: 20px;
  }
  
  .card-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    
  }
  
  .card-item {
    width: 200px;
    margin: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .card-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .card-container img {
    width: 100%;
    max-height: 200px;
    object-fit: contain;
  }
  
  .card-name {
    font-weight: bold;
    margin-top: 10px;
  }
  
  .card-price {
    margin-top: 10px;
  }
  
  button {
    margin-top: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #3e8
  }
  </style>