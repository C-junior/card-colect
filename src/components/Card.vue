<template>
    <div >
      <h2>{{ title }}</h2>
      <img :src="image" :alt="title" />
      <p>{{ description }}</p>
    </div>
  </template>
  
  <script>
 
  
  //test appchat
  export default {
    props: {
     id: {
        type: String,
        required: true,
       },
      title: {
       type: String,
         required: true,
      },
      image: {
       type: String,
       required: true,
     },
     description: {
         type: String,
        required: true,
      },
    },
}

  // test gpt
//   export default {
//     props: {
//       id: {
//         type: String,
//         required: true,
//       },
//       title: {
//         type: String,
//         required: true,
//       },
//       image: {
//         type: String,
//         required: true,
//       },
//       description: {
//         type: String,
//         required: true,
//       },
//     },
//     setup(props) {
//       const inventory = ref([]);
  
//       const addToInventory = async () => {
//         await firestore
//         const inventoryRef = firestore.collection('inventory').doc(currentUser.value.uid);
//       const inventoryData = await inventoryRef.get();

//       if (inventoryData.exists) {
//         await inventoryRef.update({
//           items: [...inventoryData.data().items, props.id],
//         });
//       } else {
//         await inventoryRef.set({
//           items: [props.id],
//         });
//       }

//       inventory.value.push(props.id);
//     };

//     return {
//       addToInventory,
//     };
//   },
// };
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  height: 400px;
  background-color: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.card-image {
  height: 60%;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 40%;
  padding: 0 20px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 10px;
}

.card-description {
  font-size: 1rem;
  text-align: center;
}
</style>