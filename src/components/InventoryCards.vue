<template>
  <div>
    <h2>Inventory</h2>
    <div class="container-inv">
      <ul>
        <li class="inventory" v-for="(item, index) in userInventory" :key="index" >
          <img :src="item.cardImg" alt="card image">
          <p> {{ item.cardName }} </p>
          <button @click="deleteItem(item)">Delete</button> <!-- Add a button to delete the item -->
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
      userInventory: []
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
    async deleteItem(item) {
      const collectionName = "inventory"; // Replace with the name of your Firestore collection
      const documentId = item.id; // Use the document ID to delete the item
      try {
        const db = firebase.firestore();
        const docRef = db.collection(collectionName).doc(documentId);
        await docRef.delete();
        console.log(`Document with ID ${documentId} successfully deleted from Firestore`);
        // Remove the deleted item from the userInventory array
        this.userInventory = this.userInventory.filter((invItem) => invItem.id !== item.id);
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  }
}
</script>
  
  <style scoped>
  .inventory{
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
 }
</style>