<template>
  <div>
    <h2>Inventory</h2>
  
  <div>
    <h2>My Inventory</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in userInventory" :key="item.id">
          <td>{{ item.name }}</td>
          
          <td>
            <button @click="confirmDelete(item)">Delete</button>
            <button @click="confirmTrade(item)">Trade</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showDeleteConfirmation">
      <p>Are you sure you want to delete this item?</p>
      <p>Gold received: {{ goldForDeletedItem }}</p>
      <button @click="deleteItemConfirmed">Yes</button>
      <button @click="cancelDelete">No</button>
    </div>

    <div v-if="showTradeConfirmation">
      <p>Are you sure you want to trade this item?</p>
      <p>Gold to be received: {{ goldForTradedItem }}</p>
      <p>Trade partner: {{ tradePartnerName }}</p>
      <button @click="confirmTradeConfirmed">Yes</button>
      <button @click="cancelTrade">No</button>
    </div>

    <div v-if="showTradeRequest">
      <p>{{ tradePartnerName }} wants to trade {{ tradeItem.name }} for {{ goldForTradedItem }} gold.</p>
      <button @click="acceptTrade">Accept</button>
      <button @click="declineTrade">Decline</button>
    </div>
  </div>
    <div class="container-inv">
      <ul class="card-list">
        <li class="card-item" v-for="(item, index) in userInventory" :key="index">
          <div class="card-container">
            <img :src="item.cardImg" alt="card image">
            <p class="card-name">{{ item.cardName }}</p>
            <button @click="confirmDelete(item)">Delete</button> <!-- Add a button to delete the item -->
          </div>
         
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  data() {
    return {
      userInventory: [],
      deleteItem: null,
      showDeleteConfirmation: false,
      tradePartnerId: '',
      tradeItem: null,
      showTradeConfirmation: false,
      tradeSuccess: false,
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
        const gold = Math.floor(Math.random() * 100) + 1; // generate random amount of gold between 1 to 100
        const data = deletedItem.data();
        const { userId } = data;
        const userRef = db.collection("userProfiles").doc(userId); // assuming you have a collection named "userProfiles"
        await db.runTransaction(async (transaction) => {
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists) {
            throw "User does not exist!";
          }
          const { gold: currentGold = 0 } = userDoc.data();
          const newGold = currentGold + gold;
          transaction.update(userRef, { gold: newGold });
          transaction.delete(docRef);
          console.log(`Document with ID ${documentId} successfully deleted from Firestore`);
          this.userInventory = this.userInventory.filter((invItem) => invItem.id !== item.id);
        });
        this.showDeleteConfirmation = false; // hide the dialog
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    },
    cancelDelete() {
      this.showDeleteConfirmation = false; // hide the dialog
    },
    async confirmTrade(item) {
      this.tradeItem = item;
      this.showTradeConfirmation = true;
    },
    async tradeConfirmed() {
  const item = this.tradeItem;
  const collectionName = "inventory";
  const documentId = item.id;
  try {
    const db = firebase.firestore();
    const docRef = db.collection(collectionName).doc(documentId);
    const tradedItem = await docRef.get();
    const gold = Math.floor(Math.random() * 100) + 1;
    const data = tradedItem.data();
    const { userId } = data;
    const userRef = db.collection("userProfiles").doc(userId);
    const tradePartnerRef = db.collection("userProfiles").doc(this.tradePartnerId);
    const tradePartnerItemData = { ...data, userId: this.tradePartnerId };
    await db.runTransaction(async (transaction) => {
      // Delete the traded item from the current owner's inventory and add it to the trade partner's inventory
      transaction.delete(docRef);
      const tradePartnerNewDoc = await db.collection(collectionName).add(tradePartnerItemData);
      console.log(`Document with ID ${documentId} successfully deleted from Firestore`);
      console.log(`New document created with ID ${tradePartnerNewDoc.id}`);
      
      // Update gold for both users
      const { gold: currentGold } = userDoc.data();
      const { gold: currentPartnerGold } = tradePartnerDoc.data();
      const newGold = currentGold + this.tradePartnerGold;
      const newPartnerGold = currentPartnerGold + gold;
      transaction.update(userRef, { gold: newGold });
      transaction.update(tradePartnerRef, { gold: newPartnerGold });

      console.log(`Document with ID ${documentId} successfully traded from user ${userId} to user ${this.tradePartnerId} in Firestore`);
      this.userInventory = this.userInventory.filter((invItem) => invItem.id !== item.id);
      this.showTradeConfirmation = false;
    });
  } catch (error) {
    console.error("Error trading document: ", error);
  }
},
cancelTrade() {
  this.showTradeConfirmation = false;
},
},
};
</script>
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