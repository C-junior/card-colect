<template>
  <div>
   
    <h2 class="title-page">Inventory</h2>
    
    <div>
    <input type="text" placeholder="Digite o nome da Carta" v-model="searchTerm" @input="searchCards"  >
    <ul>
     
   
        <div class="container-inv">
      <ul class="card-list">
        <li class="card-item" v-for="(item, index) in searchResults" :key="index">
          <div class="card-container">
            <div class="card-img"> 
            <img :src="item.cardImg" alt="card image">
            <img class="frame-inv" :src="item.cardFrame" alt="card image">
          </div>
            <p class="card-name">{{ item.cardName }}</p>
            <button class="btn btn-outline-danger mb-2" @click="confirmDelete(item)" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button> <!-- Add a button to delete the item -->
            <button class="btn bg-black text-white" @click="selectedItem = item" data-bs-toggle="modal" data-bs-target="#priceModal">Add to Market</button>

          </div>
         
        </li>
      </ul>
    </div> 
      
    </ul>
  </div>

   

    <!-- Modal delete -->
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
    </div>

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
import {reactive} from 'vue'

export default {
  name: 'AboutView',
  data() {
    return {
      userInventory: reactive([]),
      deleteItem: null,
      showDeleteConfirmation: false,
      newItem: null,
      showNewItemDialog: false,
      priceCard: '',
      currencyCard: "gold",
      selectedItem: null,
      searchTerm: "",
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

    confirmDelete(item) {
      this.deleteItem = item;
      this.showDeleteConfirmation = true;
    },

    async deleteItemFromInventory() {
      const db = firebase.firestore();
      const user = firebase.auth().currentUser;

      if (!this.deleteItem || !user) {
        return;
      }

      try {
        const inventoryItem = await db.collection("inventory").doc(this.deleteItem.id).delete();
        this.showDeleteConfirmation = false;
        this.deleteItem = null;
        alert(`Item "${this.deleteItem.cardName}" has been deleted from your inventory.`);
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete item from inventory. Please try again later.");
      }
    },
    searchCards() {
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
      return this.deleteItem.burngold;
    },
    nameForDeletedItem() {
      return this.deleteItem.cardName;
    },
    nameForSelectedItem() {
      return this.selectedItem.cardName;
    }
  },
}
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
 
  overflow:hidden;
} 

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