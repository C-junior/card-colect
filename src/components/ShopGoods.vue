<template>
<div class="shop-container">
  <div class="coverbtn">
    <h1 class="title-page">SHOP</h1></div>  
    <div class="item-row">
    <div v-for="item in itemsGem" :key="item.id" class="item-container">
    <div :class="{ 'special': item.special}">
    <img :src=item.img alt="" class="item-img"> </div>
     <div class="item-name">{{ item.name }}</div>
     <div class="item-description">{{ item.description }}</div>
     <div class="item-price"> <img src="../assets/gemshop.svg" > {{ item.price }} </div>
     <button @click="buyItem(item)" class="buy-button">Use</button>
     <div v-if="item.purchased" class="item-success-msg">{{ item.name }} purchased successfully!</div>
     </div>
    
     <div v-for="item in itemsGold" :key="item.id" class="item-container">
    <div :class="{ 'special': item.special}">
    <img :src=item.img alt="" class="item-img"> </div>
     <div class="item-name">{{ item.name }}</div>
     <div class="item-description">{{ item.description }}</div>
     <div class="item-price"> <img src="../assets/coin.svg" > {{ item.price }} </div>
     <button @click="buyItem(item)" class="buy-button">Use</button>
     <div v-if="item.purchased" class="item-success-msg">{{ item.name }} purchased successfully!</div>
     </div>
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
    const frameImgSrc = (rarity) => {
  switch (rarity) {
    case 'legendary':
      return 'https://res.cloudinary.com/dzclslnk5/image/upload/assets/frame-legendary.png';
    case 'epic':
      return 'https://res.cloudinary.com/dzclslnk5/image/upload/assets/epic-frame.png';
    case 'super-rare':
      return 'https://res.cloudinary.com/dzclslnk5/image/upload/assets/super-rare-frame.png';
    case 'rare':
      return 'https://res.cloudinary.com/dzclslnk5/image/upload/assets/rare-frame.png';
    case 'uncommon':
      return 'https://res.cloudinary.com/dzclslnk5/image/upload/assets/uncommon-frame.png';
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
const itemsGold = ref([
  {
    id: 1,
    name: 'Extra Grab',
    description: 'Reset the Grab cooldown',
    price: 300,
    img: 'https://github.com/C-junior/card-colect/blob/master/src/assets/file-plus.svg?raw=true',
    purchased: false,
    priceType: 'gold'
  },
  {
    id: 2,
    name: 'Extra Drop',
    description: 'Reset the Drop cooldown',
    price: 600,
    img: 'https://github.com/C-junior/card-colect/blob/master/src/assets/extra-drop.svg?raw=true',
    purchased: false,
    priceType: 'gold'
  },
  {
    id: 3,
    name: 'Recolor Frame',
    description: 'Change the tint of your frame randomly',
    price: 400,
    img: 'https://cdn.leonardo.ai/users/0d68a1c1-1a37-44c4-98dc-43ed5fda9265/generations/558b923d-8e03-4c5b-a1d3-b857276b9e74/variations/Default_a_magic_potion_colors_in_one_bottle_glass_flask_render_1_558b923d-8e03-4c5b-a1d3-b857276b9e74_0.png',
    purchased: false,
    priceType: 'gold'
  },
]);

const itemsGem = ref([
  {
    id: 1,
    name: 'Naruto Pack',
    description: 'Get 6 Cards from Naruto with Epic or Legendary Guarantee',
    price: 1200,
    img: 'https://github.com/C-junior/card-colect/blob/master/src/assets/narutopack.jpg?raw=true',
    purchased: false,
    special: true,
    priceType: 'gems'
  },
  {
    id: 2,
    name: 'Demon Slayer Pack',
    description: 'Get 6 Cards from Demon Slayer with Epic or Legendary Guarantee',
    price: 1200,
    img: 'https://raw.githubusercontent.com/C-junior/card-colect/master/src/assets/dsshop.png',
    purchased: false,
    special: true,
    priceType: 'gems'
  },
  {
    id: 3,
    name: 'Attack on Titan Pack',
    description: 'Get 6 Cards from Attack on Titan with Epic or Legendary Guarantee',
    price: 1200,
    img: 'https://github.com/C-junior/card-colect/blob/master/src/assets/aot.PNG?raw=true',
    purchased: false,
    special: true,
    priceType: 'gems'
  },
]);


    const buyItem = async (item) => {
  if (!user.value) {
    console.log('User not logged in');
    return;
  }

  const db = firebase.firestore();
  const userProfileRef = db.collection('userProfiles').doc(user.value.uid);
  const userProfile = await userProfileRef.get();
  const gold = userProfile.get('gold');
  const gems = userProfile.get('gems');

  if (item.priceType === 'gold') {
    if (isNaN(gold) || gold < item.price) {
      console.log(`User does not have enough gold to buy ${item.name}`);
      await Swal.fire({
        title: 'Not enough Gold!',
        text: `User does not have enough Gold to buy ${item.name}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  } else if (item.priceType === 'gems') {
    if (isNaN(gems) || gems < item.price) {
      console.log(`User does not have enough gems to buy ${item.name}`);
      await Swal.fire({
        title: 'Not enough Gems!',
        text: `User does not have enough gems to buy ${item.name}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
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
    if (item.priceType === 'gold') {
      await userProfileRef.update({
        gold: gold - item.price,
        grabAvailable: Date.now()
      });
      console.log('Item purchased successfully with gold');
    } else if (item.priceType === 'gems') {
      await userProfileRef.update({
        gems: gems - item.price,
        sendAvailable: Date.now()
      });
      console.log('Item purchased successfully with gems');
    } 
    if (item.name === 'Extra Grab') {
      await userProfileRef.update({
        gold: gold - item.price,
        grabAvaliable: Date.now()
      });
      console.log('Extra Grab purchased successfully');
    } else if (item.name === 'Extra Drop') {
      await userProfileRef.update({
        gold: gold - item.price,
        sendAvaliable: Date.now()
      });
      console.log('Extra Drop purchased successfully');
    }
    else if (item.name === 'Recolor Frame') {
      await userProfileRef.update({
        gems: gems - item.price,
        recolorFrame: (userProfile.get('recolorFrame') || 0) + 1
      });
      console.log('Recolor Frame purchased successfully');
    }
    else if (item.name === 'Naruto Pack') {
      const response = await fetch('https://api.jsonbin.io/v3/b/642c817dc0e7653a059dc7b1');
      const data = await response.json();     
      const cards = data.record.characters;      
      const randomCards = cards.sort(() => 0.5 - Math.random()).slice(0, 6);    
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
          cardId: nanoid(8),
          userId: user.value.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          rarity: rarity,
          burngold: cardGold,
          cardFrame: cardFrame,
        });
      });
      await batch.commit();
      await userProfileRef.update({
        gems: gems - item.price
      });
      console.log('Naruto Pack purchased successfully');
    }
    else if (item.name === 'Demon Slayer Pack') {
      const response = await fetch('https://api.jsonbin.io/v3/b/64628da78e4aa6225e9dadc2');
      const data = await response.json();     
      const cards = data.record.characters;      
      const randomCards = cards.sort(() => 0.5 - Math.random()).slice(0, 6);    
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
          cardId: nanoid(8),
          userId: user.value.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          rarity: rarity,
          burngold: cardGold,
          cardFrame: cardFrame,
        });
      });
      await batch.commit();
      await userProfileRef.update({
        gems: gems - item.price
      });
      console.log('Demon Slayer Pack purchased successfully');
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
        gems: gems - item.price
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
      itemsGold,
      itemsGem,
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
  top:-18px;
  width: max-content;
  color: #831714;
 }
 .item-row {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
  }

  .item-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 20px;
    background-color: rgb(36, 36, 36);
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
.item-img{
    max-height: 100px;
    width: auto;
    z-index: 9;
}

 .special {
  position: relative;
  overflow: hidden;
  padding: 5px;
}

.special:before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  transform: rotate(45deg);
  z-index: 1;
  background: linear-gradient(to right, #f8a170, #ffcd75, #490303, #490303, #72a6ff, #bea410, #bea410,#af1d1d,#6e0808);
  background-size: 300% 300%;
  animation: gradientAnimation 2s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}  rotate animation 

.buy-button:hover {
  background-color: #b30000;
}
/* @media (min-width: 576px) {
  .item-container {
    width: 50%;
    max-width: none;
  }
} */
</style>