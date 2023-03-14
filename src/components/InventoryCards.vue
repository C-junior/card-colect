<template>
    <div>
      <h2>Inventory</h2>
      <div class="container-inv">
      <ul>
        <li class="inventory" v-for="(item, index) in userInventory" :key="index">
          <img :src="item.cardImg" alt="card image">
          <p>{{ item.cardName }}</p>
          
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
            this.userInventory.push(doc.data());
          });
        });
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
    flex-direction: row 1fr 1fr 1fr;
    flex-wrap: wrap;
 }
</style>