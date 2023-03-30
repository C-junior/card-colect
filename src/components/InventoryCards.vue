<template>
  <div>
   
    <h2>Inventory</h2>
        <div class="modal" v-if="showDeleteConfirmation">
  <div class="modal-content">
    <h2>Are you sure you want to delete "{{nameForDeletedItem }}"?</h2>
    <p>You will receive {{ goldForDeletedItem }} gold.</p>
    <div>
      <button @click="deleteItemConfirmed">Delete</button>
      <button @click="cancelDelete">Cancel</button>
    </div>
  </div>
</div>
    <div class="container-inv">
      <ul class="card-list">
        <li class="card-item" v-for="(item, index) in userInventory" :key="index">
          <div class="card-container">
            <img :src="item.cardImg" alt="card image">
            <p class="card-name">{{ item.cardName }}</p>
            <button @click="confirmDelete(item)">Delete</button> <!-- Add a button to delete the item -->
            <button @click="addToMarket(item)">Add to Market</button>
          </div>
         
        </li>
      </ul>
    </div> 
    <div>
    <button @click="showModal = true">Open Modal</button>
    <modal
      :show="showModal"
      title="Select an option and enter a value"
      @cancel="showModal = false"
      @submit="handleModalSubmit"
    ></modal>
  </div>
  </div>
</template>
<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import Modal from "./ModalMarket.vue";

export default {
  components: {
    Modal,
  },
  data() {
    return {
      userInventory: [],
      deleteItem: null,
      showDeleteConfirmation: false,
      newItem: null,
      showNewItemDialog: false,
      newItemPrice: 0,
      newItemPriceType: 'gold',
      showModal: false,
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
          const { burngold: currentGold = 0 } = userDoc.data();
          const newGold = currentGold + itemGold;
          transaction.update(userRef, { burngold: newGold });
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
  
  // Ask the user for the price and currency tirar quando modal funcionar , começa aki
  const price = prompt(`Enter a price for ${itemName}:`);
  if (price === null) {
    // User clicked "Cancel" button
    return;
  }
  const currency = prompt(`Select a currency for the price (gold or gems):`);
  if (currency === null) {
    // User clicked "Cancel" button
    return;
  }
  
  // Validate the price and currency termina antes ou dps daqui
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
    }
    
    alert(`${itemName} has been added to the market for ${parsedPrice} ${currency}.`);
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Failed to add item to market. Please try again later.");
  }
},
handleModalSubmit(data) {
      // Handle the modal submission here
      console.log(data);
      this.showModal = false;
    },
  },
  computed: {
    goldForDeletedItem() {
      return this.deleteItem.burngold;
    },
    nameForDeletedItem() {
      return this.deleteItem.cardName;
    },
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
 .card-list {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;
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
    height: 150px;
  }
</style>