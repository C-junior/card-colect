<template>
    <div class="ranking-container">
      <h2 class="title">Ranking Players</h2>
      <ul class="ranking-list">
        <li v-for="(player, index) in sortedPlayers" :key="player.id" :class="{'first-place': index === 0, 'second-place': index === 1, 'third-place': index === 2}">
          <div v-if="index < 3" class="player-info">
            <div class="player-photo">
              <img :src="player.photoUrl" alt="player photo">
            </div>
            <div v-if="index === 0" class="player-sticker ">
                <img src="../assets/chibilol1.png" alt="player sticker">
            </div>
            <div v-if="index === 1" class="player-sticker ">
                <img src="../assets/chibilol2.png" alt="player sticker">
            </div>
            <div v-if="index === 2" class="player-sticker ">
                <img src="../assets/chibilol3.png" alt="player sticker">
            </div>

            <div class="player-details">
              <div class="player-name">{{ player.userName }}</div>
              <div class="player-inventory">{{ player.inventoryCount }} cards</div>
            </div>
          </div>
          <div v-else class="player-info">
            {{ index + 1 }}. {{ player.userName }} ({{ player.inventoryCount }} cards)
          </div>        
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, computed, onUnmounted } from 'vue';
  import { firestore, useAuth } from '@/firebase';
  
  export default {
    setup() {
        const { user } = useAuth()
      const players = ref([]);
      const unsubscribe = firestore.collection('userProfiles').onSnapshot(async snapshot => {
        const docs = snapshot.docs;
        const promises = [];
        for (const doc of docs) {
          const user = doc.data();
          const inventoryRef = await firestore.collection("inventory").where("userId", "==", doc.id).get();
          const inventoryCount = inventoryRef.docs.length;
          const player = {
            id: doc.id,
            userName: user.userName,
            inventoryCount,
            photoURL: user.photoURL,
          };
          players.value.push(player);
        }
      });
      const sortedPlayers = computed(() => {
        return players.value.sort((a, b) => b.inventoryCount - a.inventoryCount);
      });
      onUnmounted(() => {
        unsubscribe();
      });
      return { sortedPlayers };
    },
  };
  </script>
  
  <style scoped>
 .ranking-container {
  background-color: black;
  color: white;
  padding: 1rem;
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.ranking-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.player-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: #282828;
  border-radius: 12px;
}

.first-place .player-info {
  border: 2px solid red;
  padding: 2rem;
}

.second-place .player-info {
  border: 2px solid #ff7f00;
}

.third-place .player-info {
  border: 2px solid yellow;
}

.player-photo {
  height: 5rem;
  width: 5rem;
  border: 5px solid #ffffff;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
}

.player-photo img {
  height: 100%;    
  width: 100%;
  object-fit: cover;
}

.player-sticker {
  height: 5rem;
  width: 5rem;
  position: absolute;
  right: 10px;
}

.player-sticker img {
  height: 100%;
  width: 100%;
  object-fit: cover;
 
}

.player-details {
  flex: 1;
}

.player-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.player-inventory {
  font-size: 0.9rem;
}

</style>