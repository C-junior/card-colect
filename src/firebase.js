import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { nanoid } from 'nanoid';
import LRU from 'lru-cache';

import { ref, onUnmounted, computed } from 'vue'

// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyALxDocM3rzVBaDHZQZ3i5zIJt3klJqH-o",
  authDomain: "card-colect.firebaseapp.com",
  projectId: "card-colect",
  storageBucket: "card-colect.appspot.com",
  messagingSenderId: "1065828021976",
  appId: "1:1065828021976:web:eb3ec67726cd9f8b6849ad"
};


firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

//   }
 // try create a profile code
  export function useAuth() {
    const user = ref(null)
    const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))
    onUnmounted(unsubscribe)
    const isLogin = computed(() => user.value !== null)
  
    const signIn = async () => {
      const googleProvider = new firebase.auth.GoogleAuthProvider()
      await auth.signInWithPopup(googleProvider)
      // Create a user profile if it doesn't exist
      const userProfileRef = firestore.collection('userProfiles').doc(user.value.uid)
      const userProfile = await userProfileRef.get()
      if (!userProfile.exists) {
        await userProfileRef.set({
          gold: 0,
          gems: 0,
          sendCount: 0,
          getCount: 0
        })
      }
    }
    const signOut = () => auth.signOut()
  
    return { user, isLogin, signIn, signOut }
  }

  //end of try

export const firestore = firebase.firestore()
const messagesCollection = firestore.collection('messages')
const inventoryCollection = firestore.collection('inventory')
const messagesRef = firebase.firestore().collection("messages");
const cardRef = firebase.firestore().collection("inventory");
const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(12)
const invetoryQuery = inventoryCollection.orderBy('createdAt', 'desc')
const cache = new LRU({
  max: 100,
  maxAge: 1000 * 60 * 5, // 5 minutes
});

export function useChat() {
  const messages = ref(cache.get('messages') || []);
  const unsubscribe = messagesQuery.onSnapshot(snapshot => {
    messages.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .reverse();
    cache.set('messages', messages.value);
  });
  onUnmounted(unsubscribe);
           const naruto = 'https://api.jsonbin.io/v3/b/642c817dc0e7653a059dc7b1';
           const shingeki = 'https://api.jsonbin.io/v3/b/64385b2fc0e7653a05a3bf79';
           //const fefates = 'https://api.jsonbin.io/v3/b/63f927aeebd26539d084bb26/latest';
           const cards = [];
           
           Promise.all([
             fetch(naruto).then(response => response.json()),
             fetch(shingeki).then(response => response.json())
           ])
             .then(data => {
               // Concatenate the character arrays from both sources
              // cards.push(...data[0].record.characters);
               cards.push(...data[0].record.characters, ...data[1].record.characters);
               console.log(cards); // log the merged array to the console
             })
             .catch(error => {
               console.error(error);
             });
        
           const { user, isLogin } = useAuth()
           const rarities = {
  common: 30,         // 1/21 chance
  uncommon: 20,       // 2/21 chance
  rare: 10,           // 4/21 chance
  'super-rare': 6,   // 6/21 chance
  epic: 4,           // 7/21 chance
  legendary: 1       // 1/21 chance
};

           const sendMessage = image => {
            if (!isLogin.value) return;
            const selectedCards = [];
  const totalWeight = Object.values(rarities).reduce((acc, val) => acc + val, 0);
  while (selectedCards.length < 3) {
    const rand = Math.random() * totalWeight;
    let acc = 0;
    for (const [rarity, weight] of Object.entries(rarities)) {
      acc += weight;
      if (rand <= acc) {
        const cardsOfRarity = cards.filter(card => card.rarity === rarity);
        const card = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
        if (!selectedCards.includes(card)) {
          selectedCards.push(card);
        }
        break;
      }
    }
  }
            const { photoURL, uid, displayName } = user.value;
            selectedCards.forEach(card => {
              const rarity = card.rarity;
            
              const { cardName, image: cardImg } = card;
              const message = {
                cardName: card.name,
                cardImg: card.image,
                cardId: nanoid(8),
                rarity,
                userName: displayName,
                image,
                userId: uid,
                userPhotoURL: photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
              };
              messagesRef.add(message)
                .then(docRef => {
                  console.log(`Message written with ID: ${docRef.id}`);
                  // Update send count of the user
                  const userDocRef = firestore.collection('userProfiles').doc(uid);
                  userDocRef.get().then(doc => {
                    if (doc.exists) {
                      const sendCount = doc.data().sendCount || 0;
                      userDocRef.update({ sendCount: sendCount + 1 });
                    } else {
                      userDocRef.set({ sendCount: 1 });
                    }
                  });
                })
                .catch(error => console.error(`Error adding message: ${error}`));
            });
          };
          const updateUserProfile = (uid) => {
            const userDocRef = firestore.collection('userProfiles').doc(uid);
          
            // Get the current userProfile document
            userDocRef.get().then((doc) => {
              if (doc.exists) {
                // If the document exists, update the grabAvaliable count
                const userProfile = doc.data();
                const now = new Date();
                const lastUpdate = new Date(userProfile.lastGrabAvaliableUpdate);
                const minutesSinceLastUpdate = Math.floor((now - lastUpdate) / (1000 * 60));
          
                // Increase the grabAvaliable count by 1 for every 5 minutes that have passed
                const newGrabAvaliable = Math.min(
                  userProfile.grabAvaliable + Math.floor(minutesSinceLastUpdate / 5),
                  2
                );
          
                // Update the userProfile document with the new grabAvaliable count
                userDocRef.update({
                  grabAvaliable: newGrabAvaliable,
                  lastGrabAvaliableUpdate: now,
                });
              } else {
                // If the document doesn't exist, create a new userProfile with a grabAvaliable count of 1
                const now = new Date();
                userDocRef.set({
                  grabAvaliable: 1,
                  lastGrabAvaliableUpdate: now,
                });
              }
            });
          };
          
          const getCard = (message) => {
            const { uid, displayName } = user.value;
          
            // Check if the user has any grabAvaliable left
            const userDocRef = firestore.collection('userProfiles').doc(uid);
            userDocRef.get().then((doc) => {
              if (doc.exists) {
                const userProfile = doc.data();
                if (userProfile.grabAvaliable === 0) {
                  console.error('Error: no grabAvaliable left');
                  return;
                }
              }
              const gold = getCardGold(message.rarity);
    
              const inventoryItem = {
                userName: displayName,
                userId: uid,
                userPhotoURL: photoURL,
                cardImg: message.cardImg,
                cardName: message.cardName,
                cardId: message.cardId,
                rarity: message.rarity,
                burngold: gold,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              };
          
              cardRef
                .add(inventoryItem)
                .then((docRef) => {
                  console.log(`Inventory item written with ID: ${docRef.id}`);
                  
                  // Decrease the user's grabAvailable count by 1 in the database
                  userDocRef.update({ grabAvailable: grabAvailable - 1 });
                  
                  return docRef.id; // Return the ID of the new inventory item
                })
                .catch((error) => {
                  console.error(`Error adding inventory item: ${error}`);
                  return null; // Return null if there was an error
                });
            }).catch((error) => {
              console.error(`Error getting user profile: ${error}`);
              return null; // Return null if there was an error
            });
          };
          
          // Helper function to get the gold value for a card based on its rarity
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
          
          
const inventoryRef = firebase.firestore().collection('inventory');

  return { messages, sendMessage, messagesRef, getCard, inventoryRef };
}
export const currentUser = auth.user;