<template>
  <div>
   
    <h2 class="title-page">Inventory</h2>
    
    <div>
    <input type="text" placeholder="Digite o nome da Carta" v-model="searchTerm" @input="searchCards"  >
    <ul>     
   
        <div class="container-inv">
      <ul class="card-list">
        <li class="card-item" v-for="(item, index) in searchResults" :key="index">
  <div class="card-container" >
    <div class="card-img" @click="showOverlay = index" > 
      <img class="imagem-card" :src="item.cardImg" alt="card image" >
     
      <img class="frame-inv" :src="item.cardFrame" alt="card image" :style="{ filter: item.recolorEffect }" >
    </div>
    <p class="card-name">{{ item.cardName }}</p>
    <button class="btn btn-outline-danger mb-2" @click="confirmDelete(item)">Delete</button>
    <div v-if="showDeleteConfirmation && deleteItem.id === item.id">
      <p>Are you sure you want to delete "{{ item.cardName }}" for {{ goldForDeletedItem }} gold ?</p>
      <button @click="deleteItemConfirmed">Yes</button>
      <button @click="showDeleteConfirmation = false">No</button>
    </div>
    <!-- Add a button to delete the item -->
    <button class="btn bg-black text-white" @click="selectedItem = item" data-bs-toggle="modal" data-bs-target="#priceModal">Add to Market</button>
  </div>
  <div class="recolor-btn" v-if="userHasRecolorFrame && userProfiles.recolorFrame > 0" @click="applyRecolorEffect(item); decreaseRecolorFrame()">  
    <span class="badge">{{  userProfiles.recolorFrame  }}</span>
    <img  class="recolor-img" src="https://cdn.leonardo.ai/users/0d68a1c1-1a37-44c4-98dc-43ed5fda9265/generations/558b923d-8e03-4c5b-a1d3-b857276b9e74/variations/Default_a_magic_potion_colors_in_one_bottle_glass_flask_render_1_558b923d-8e03-4c5b-a1d3-b857276b9e74_0.png" alt="">
   </div>
</li>
      </ul>
      <div class="overlay" v-if="showOverlay !== null" @click.self="showOverlay = null">
      <div class="content">
        <div class="image-card-container" @click="isRotated = !isRotated">
    <div class="image-card" :class="{ 'is-rotated': isRotated }">
      <div class="image-front">
        <img :src="searchResults[showOverlay].cardImg" alt="card image" />
      </div>
      <div class="image-back">
        <img src="../assets/logogg.png" alt="" class="backlogo">
        <h2>{{ searchResults[showOverlay].cardName }}</h2>
        <div class="divider"></div>
        <h3>{{ searchResults[showOverlay].userName }}</h3>
        <p>Series: {{ searchResults[showOverlay].cardSerie }}</p>
        <p>Rarity: {{ searchResults[showOverlay].rarity.toUpperCase() }}</p>
        <!-- Add more details as needed -->
      </div>
    </div>
  </div>
      </div>    
    </div>
    </div> 
     
    </ul>
  </div>
    <!-- Modal delete 
    <div class="modalDelete" v-if="showDeleteConfirmation">
      <div class="modal fade " id="deleteModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog ">
          <div class="modal-content bg-black bg-gradient">
            <h2>Are you sure you want to delete "{{nameForDeletedItem }}"?</h2>
            <p>You will receive {{ goldForDeletedItem }} gold.</p>
            <div>
              <button @click="deleteItemConfirmed" data-bs-dismiss="modal">Delete</button>
              <button data-bs-dismiss="modal" @click="cancelDelete">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>-->

    <!-- Modal -->
    <div class="modal fade " id="priceModal"  aria-labelledby="priceModalLabel" aria-hidden="true">
      <div class="modal-dialog ">
        <div class="modal-content bg-black bg-gradient">
          <div class="modal-header">
            <h2 class="modal-title text-white fs-5 " id="priceModalLabel" v-if="selectedItem">Enter the Price for {{ selectedItem.cardName }}  </h2>

            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <select class="form-select" size="3" aria-label="size 3 select example" v-model="currencyCard">
              <option selected>Select the currency</option>
              <option value="gold">Gold</option>
              <option value="gems">Gems</option>
            </select>
            <input type="text" v-model="priceCard">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" @click="addToMarket(selectedItem)" class="btn btn-primary" data-bs-dismiss="modal">Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import { reactive, watch} from 'vue';

export default {
  name: 'AboutView',
  data() {
    return {
      userInventory: reactive([]),
      userProfiles: reactive({}),
      deleteItem: null,
      showDeleteConfirmation: false,
      newItem: null,
      showNewItemDialog: false,
      priceCard: '',
      currencyCard: "gold",
      selectedItem: null,
      searchTerm: "",
      showOverlay: null,     
      userHasRecolorFrame: false, // New property
      clickedItemIndex: -1, // add this property
      isRotated: false,
    }
  },
 
  async created() {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser;
  if (user) {
    // Fetch user inventory
    const querySnapshot = await db.collection("inventory").where("userId", "==", user.uid).get();
    querySnapshot.forEach((doc) => {
      this.userInventory.push({ ...doc.data(), id: doc.id });
    });

     // fetch user profile
  if (user) {
    const userProfileRef = db.collection("userProfiles").doc(user.uid);
    userProfileRef.onSnapshot((doc) => {
      if (doc.exists) {
        this.userProfiles = doc.data();
      } else {
        // user profile does not exist, handle it accordingly
      }
    });
  }
    // Check if user has any recolorFrame in their userProfile collection
    const userProfileRef = db.collection("userProfiles").doc(user.uid);
    console.log('userProfileRef:', userProfileRef);
    const userProfileDoc = await userProfileRef.get();
    if (userProfileDoc.exists) {
      const userProfileData = userProfileDoc.data();
      console.log('userProfileData.recolorFrame:', userProfileData.recolorFrame);
      if (userProfileData.recolorFrame> 0) {
        this.userHasRecolorFrame = true;
        this.recolorFrameCount = userProfileData.recolorFrame; // set the recolor frame count
      }
    } else {
      console.log("User profile document does not exist");
  // Add user profile document with recolorFrame field
  await userProfileRef.set({ recolorFrame: 0 });
  console.log("User profile document added");
    }
  }
  this.userInventory.sort((a, b) => b.createdAt - a.createdAt);
},

  methods: {
  async applyRecolorEffect(item) {
    const deg = Math.floor(Math.random() * 360);
    item.recolorEffect = `hue-rotate(${deg}deg)`;
    const db = firebase.firestore();
    const inventoryRef = db.collection("inventory").doc(item.id);
    await inventoryRef.update({
      recolorEffect: item.recolorEffect
    });
  },

  async decreaseRecolorFrame() {
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;
    if (user) {
      const userProfileRef = db.collection("userProfiles").doc(user.uid);
      const userProfileDoc = await userProfileRef.get();
      if (userProfileDoc.exists) {
        const userProfileData = userProfileDoc.data();
        if (userProfileData.recolorFrame > 0) {
          await userProfileRef.update({
            recolorFrame: userProfileData.recolorFrame - 1
          });
        }
      }
    }
  },
    async addToMarket(item) {
        const db = firebase.firestore();
        const user = firebase.auth().currentUser;
        const itemName = item.cardName;
        
    
        
        // Ask the user for the price and currency
        const price = this.priceCard
        if (price === null) {
          // User clicked "Cancel" button
          return;
        }
        const currency = this.currencyCard
        if (currency === null) {
          // User clicked "Cancel" button
          return;
        }
        // Validate the price and currency
        const parsedPrice = parseInt(price, 10);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
          alert("Invalid price. Please enter a positive number.");
          return;
        }
        const currencies = ['gold', 'gems'];
        if (!currencies.includes(currency.toLowerCase())) {
          alert("Invalid currency. Please enter either gold or gems.");
          return;
        }
        
        try {
          // Add the item to the market collection
          await db.collection("market").add({...item,
            userId: user.uid,
            price: parsedPrice,
            currency: currency.toLowerCase(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          
          // Remove the item from the user's inventory collection
          const inventoryItem = await db.collection("inventory").where("userId", "==", user.uid)
            .where("cardName", "==", itemName).limit(1).get();
          if (!inventoryItem.empty) {
            await inventoryItem.docs[0].ref.delete();
            this.userInventory = this.userInventory.filter((invItem) => invItem.id !== item.id);
          }
          
          // alert(`${itemName} has been added to the market for ${parsedPrice} ${currency}.`);
        } catch (error) {
          console.error("Error adding document: ", error);
          alert("Failed to add item to market. Please try again later.");
        }
      },
    async confirmDelete(item) {
      this.deleteItem = item;
      this.showDeleteConfirmation = true;
    },
    async deleteItemConfirmed() {
      const item = this.deleteItem;
      const collectionName = "inventory";
      const documentId = item.id;
      try {
        const db = firebase.firestore();
        const docRef = db.collection(collectionName).doc(documentId);
        const deletedItem = await docRef.get();
        const data = deletedItem.data();
        const { userId, burngold: itemGold } = data;
        const userRef = db.collection("userProfiles").doc(userId);
        await db.runTransaction(async (transaction) => {
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists) {
            throw "User does not exist!";
          }
          const { gold: currentGold = 0 } = userDoc.data();
          const newGold = currentGold + itemGold;
          transaction.update(userRef, { gold: newGold });
          transaction.delete(docRef);
          console.log(`Document with ID ${documentId} successfully deleted from Firestore ${newGold}  `);
          this.userInventory = this.userInventory.filter((invItem) => invItem.id !== item.id);
        });
        this.showDeleteConfirmation = false;
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    },
    async deleteItemFromInventory() {
      const db = firebase.firestore();
      const user = firebase.auth().currentUser;
      if (!this.deleteItem || !user) {
        return;
      }
      try {
        await db.collection("inventory").doc(this.deleteItem.id).delete();
        this.showDeleteConfirmation = false;
        alert(`Item "${this.deleteItem.cardName}" has been deleted from your inventory.`);
        this.deleteItem = null;
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete item from inventory. Please try again later.");
      }
    }, searchCards() {
        const regex = new RegExp(this.searchTerm, 'i');
        this.searchResults = this.userInventory.filter(item => {
          return regex.test(item.cardName) || regex.test(item.cardSerie);
        });
      }
  },
  computed: {
    searchResults() {
        const regex = new RegExp(this.searchTerm, 'i');
        return this.userInventory.filter(item => {
          return regex.test(item.cardName) || regex.test(item.cardSerie);
        });
      },
    goldForDeletedItem() {
      return this.deleteItem?.burngold;
    },
    nameForDeletedItem() {
      return this.deleteItem?.cardName;
    },
    nameForSelectedItem() {
      return this.selectedItem?.cardName;
    }
  },
  watch: {
    showOverlay(newVal, oldVal) {
      if (newVal !== oldVal && newVal === null) {
        // Overlay was closed, reset any overlay-related data here
      }
    },
  },
};
</script>
<!-- <script>
import firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  data() {
    return {
      userInventory: [],
      deleteItem: null,
      showDeleteConfirmation: false,
    }
  },
  created() {
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;
    if (user) {
      db.collection("inventory").where("userId", "==", user.uid).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.userInventory.push({...doc.data(), id: doc.id}); // Include the document ID in the userInventory array
        });
      });
    }
  },
  methods: {
    async confirmDelete(item) {
      this.deleteItem = item; // store the item to be deleted
      this.showDeleteConfirmation = true; // show the confirmation dialog
    },
  
    async deleteItemConfirmed() {
      // delete the item and update the user's gold
      const item = this.deleteItem;
      const collectionName = "inventory";
      const documentId = item.id;
      try {
        const db = firebase.firestore();
        const docRef = db.collection(collectionName).doc(documentId);
        const deletedItem = await docRef.get();
        const data = deletedItem.data();
        const { userId, gold: itemGold } = data;
        const userRef = db.collection("userProfiles").doc(userId);
        await db.runTransaction(async (transaction) => {
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists) {
            throw "User does not exist!";
          }
          const { gold: currentGold = 0 } = userDoc.data();
          const newGold = currentGold + itemGold;
          transaction.update(userRef, { gold: newGold });
          transaction.delete(docRef);
          console.log(`Document with ID ${documentId} successfully deleted from Firestore`);
          this.userInventory = this.userInventory.filter((invItem) => invItem.id !== item.id);
        });
        this.showDeleteConfirmation = false;
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    },

    async addToMarket(item) {
      const db = firebase.firestore();
      const marketRef = db.collection("market");
      const user = firebase.auth().currentUser;
      const marketItem = {
        userId: user.uid,
        cardName: item.cardName,
        price: 10 // Set the price to 10 gold (you can change this to whatever you want)
      }
      try {
        await marketRef.add(marketItem);
        console.log("Item added to market");
        this.userInventory = this.userInventory.filter((invItem) => invItem.id !== item.id);
      } catch (error) {
          console.error("Error adding item to marketplace: ", error);
        }
      }
   
    
  },
  computed: {
    goldForDeletedItem() {
      return this.deleteItem.gold;
    },
    nameForDeletedItem() {
      return this.deleteItem.cardName;
    },
  },
}
</script> -->

  
  <style scoped>
  /* .inventory{
    display: block;
  text-align: center;
  width: 210px;
  margin-left: 20px;
  margin-bottom: 20px;
  border: 3px red solid;
  border-radius: 12px;
  overflow:hidden;
  }
  .inventory img {
    height: 150px;
  }
 .container-inv{
    display: inline-flex;
    flex-direction: column 1fr 1fr 1fr;
    flex-wrap: wrap;
 } */

/* search style start*/
/* Search bar */
input[type="text"] {
  width: 80%;
  padding: 12px 20px;
  position: relative;
  left: 10%;
  margin: 8px auto;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-image: url("../assets/search.svg");
  background-position: 96% 10px;
  background-repeat: no-repeat;
  background-size:28px;
}

/* start rotate img*/
.image-card-container {
  display: inline-block;
  width: 250px;
  height: 350px;
  margin: 20px;
  perspective: 1000px;
}

.image-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s;
}
.backlogo{
  position: absolute;
  overflow: hidden;
  height: fit-content;
  left: 0;
  opacity: 0.1;
}

.divider{
  background-color: #831714;
  width: 90%;
  height: 1px;
  margin: auto;
}
.is-rotated {
  transform: rotateY(180deg);
}

.image-front,
.image-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  overflow: hidden;
}

.image-back {
  transform: rotateY(180deg);
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  background-color: rgb(20, 20, 20);

  color: rgb(240, 240, 240);
  font-size: 1.2rem;
  border: #831714 solid 3px;
}

.recolor-btn{
  position: absolute;
  top:0;
  right: -10px;
  z-index: 99;
  
}
.recolor-btn .badge {
  position: absolute;
  top: 0px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #831714;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.recolor-img{
  width: 80px !important;
}

/* Search results list */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

/* search style end*/
.card-img{
  display: block;
  text-align: center;
} 

/* overlay start img*/
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
}

.content img {
  width: 100%;
  height: auto;
}
/* overlay end img*/
.frame-inv {  
  position: absolute;
  left: 28px;
  height: 208px;
  width: 125px;
  filter: hue-rotate(0deg);
  z-index: 10;
}
 .container-inv{
  max-width: 1200px;
  display: flex;
  margin: auto;
 }
 .title-page{
  text-align: center;
  color: #831714;
 }
 .card-list {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;
    justify-content: center;
  }
  
  .card-item {
    margin: 10px;
    border: 2px solid rgb(199, 8, 8);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    transition: transform 0.5s;
    cursor: pointer;
  }
  
  .card-item:hover {
    transform: translateY(-5px);
  }
  
  .card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    width: 200px;
  }
  
  .card-name {
    font-size: 1.2rem;
    text-align: center;
    margin-top: 10px;
  }
  
  .card-name::before,
  .card-name::after {
    content: "";
    display: block;
    height: 1px;
    background-color: #ccc;
    width: 50%;
    margin: 5px 0;
  }
  
 img {
  width: 120px;
  }
</style>