<template>
    <div class="shop-container">
      <h1 class="shop-title">Shop</h1>
      <div v-for="item in items" :key="item.id" class="item-container">
        <img :src="`../src/assets/${item.img}`" alt=""  height="100"> <div class="item-name">{{ item.name }}</div>
        <div class="item-description">{{ item.description }}</div>
        <div class="item-price"> <img src="../assets/coin.svg" > {{ item.price }} </div>
        <button @click="buyItem(item)" class="buy-button">Use</button>
        <div v-if="item.purchased" class="item-success-msg">{{ item.name }} purchased successfully!</div>
      </div>
    </div>
  </template>

<script>
import { ref } from 'vue';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useAuth } from '@/firebase.js';
import Swal from 'sweetalert2';
import { nanoid } from 'nanoid';

export default {
  name: 'ShopView',
  setup() {
    const { user } = useAuth();
    const items = ref([
      { id: 1, name: 'Extra Grab', description: 'Get an extra grab', price: 600, img: 'extra-drop.svg', purchased: false },
      { id: 2, name: 'Extra Drop', description: 'Get an extra drop', price: 300, img: 'file-plus.svg', purchased: false },
      { id: 3, name: 'Naruto Pack', description: 'Get 6 Cards from Naruto with Epic or Legendary Guarantee', price: 1200, img: 'narutopack.jpg', purchased: false },
      { id: 4, name: 'Attack on Titan Pack', description: 'Get 6 Cards from Attack on Titan with Epic or Legendary Guarantee', price: 1200, img: 'aot.png', purchased: false },
    ]);
    const frameImgSrc = (rarity) => {
  switch (rarity) {
    case 'legendary':
      return 'https://res.cloudinary.com/dzclslnk5/image/upload/assets/frame-legendary.png';
    case 'epic':
      return 'https://res.cloudinary.com/dzclslnk5/image/upload/assets/frame-epics.png';
    case 'super-rare':
      return 'https://res.cloudinary.com/dzclslnk5/image/upload/assets/frame-super-rare.png';
    case 'rare':
      return 'https://res.cloudinary.com/dzclslnk5/image/upload/assets/frame-rare.png';
    case 'uncommon':
      return 'https://res.cloudinary.com/dzclslnk5/image/upload/assets/frame-uncommon.png';
    default:
      return 'https://res.cloudinary.com/dzclslnk5/image/upload/assets/frame-common.png';
  }
};

const getCardGold = (rarity) => {
  switch (rarity) {
    case 'legendary':
      return Math.floor(Math.random() * 100) + 120;
    case 'epic':
      return Math.floor(Math.random() * 80) + 80;
    case 'super-rare':
      return Math.floor(Math.random() * 40) + 60;
    case 'rare':
      return Math.floor(Math.random() * 30) + 40;
    case 'uncommon':
      return Math.floor(Math.random() * 20) + 20;
    default:
      return Math.floor(Math.random() * 10) + 2;
  }
};


const buyItem = async (item) => {
  if (!user.value) {
    console.log('User not logged in');
    return;
  }

  const db = firebase.firestore();
  const userProfileRef = db.collection('userProfiles').doc(user.value.uid);
  const userProfile = await userProfileRef.get();
  const gold = userProfile.get('gold');

  if (gold < item.price) {
    console.log(`User does not have enough gold to buy ${item.name}`);
    return;
  }

  let confirmation = await Swal.fire({
    title: `Are you sure you want to buy ${item.name}?`,
    icon: 'question',
    showCancelButton: true,
    background: '#313131',
    confirmButtonColor: '#831714',
    cancelButtonColor: '#808080',
    confirmButtonText: 'Yes, buy it!',
    cancelButtonText: 'No, cancel'
  });

  if (confirmation.isConfirmed) {
    if (item.name === 'Extra Grab') {
      await userProfileRef.update({
        gold: gold - item.price,
        grabAvaliable: Date.now()
      });
      console.log('Extra Grab purchased successfully');
    } else if (item.name === 'Extra Drop') {
      await userProfileRef.update({
        gold: gold - item.price,
        dropAvaliable: Date.now()
      });
      console.log('Naruto Pack purchased successfully');
    }
    else if (item.name === 'Naruto Pack') {
      const response = await fetch('https://api.jsonbin.io/v3/b/642c817dc0e7653a059dc7b1');
      const data = await response.json();
      console.log(data);
      const cards = data.record.characters;
      console.log(cards);
      const randomCards = cards.sort(() => 0.5 - Math.random()).slice(0, 6);
      console.log('Randomly selected 6 cards:', randomCards);
      const batch = db.batch();
      const userCardsRef = db.collection('inventory');
      randomCards.forEach((card) => {
        const newCardRef = userCardsRef.doc();
        const rarity = card.rarity;
        const cardGold = getCardGold(rarity);
        const cardFrame = frameImgSrc(rarity);
        batch.set(newCardRef, {
          cardName: card.name,
          cardImg: card.image,
          cardSerie: card.serie,
          cardId: newCardRef.id,
          userId: user.value.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          rarity: rarity,
          burngold: cardGold,
          cardFrame: cardFrame,
        });
      });
      await batch.commit();
      await userProfileRef.update({
        gold: gold - item.price
      });
      console.log('Naruto Pack purchased successfully');
    }
    else if (item.name === 'Attack on Titan Pack') {
      const response = await fetch('https://api.jsonbin.io/v3/b/64385b2fc0e7653a05a3bf79');
      const data = await response.json();
      console.log(data);
      const cards = data.record.characters;
      console.log(cards);
      const randomCards = cards.sort(() => 0.5 - Math.random()).slice(0, 6);
      console.log('Randomly selected 6 cards:', randomCards);
      const batch = db.batch();
      const userCardsRef = db.collection('inventory');
      randomCards.forEach((card) => {
        const newCardRef = userCardsRef.doc();
        const rarity = card.rarity;
        const cardGold = getCardGold(rarity);
        const cardFrame = frameImgSrc(rarity);
        batch.set(newCardRef, {
          cardName: card.name,
          cardImg: card.image,
          cardSerie: card.serie,
          cardId: newCardRef.id,
          userId: user.value.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          rarity: rarity,
          burngold: cardGold,
          cardFrame: cardFrame,
        });
      });
      await batch.commit();
      await userProfileRef.update({
        gold: gold - item.price
      });
      console.log('Attack on Titan Pack purchased successfully');
    }
    item.purchased = true;
    await Swal.fire({
      title: 'Purchase complete!',
      text: `${item.name} purchased successfully.`,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  } else {
    console.log(`User cancelled purchase of ${item.name}`);
  }
};

    return {
      items,
      buyItem,
    };
  },
};
</script>
  <style scoped>

.my-swal {
  background-color: rgb(29, 29, 29);
  color: #831714;
}
.shop-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: rgb(43, 43, 43);
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