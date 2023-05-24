import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { nanoid } from 'nanoid';
//import LRU from 'lru-cache';

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


// try persist crds
firebase.firestore().enablePersistence()
  .catch((error) => {
    if (error.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      // ...
    } else if (error.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence.
      // ...
    }
  });

//end of persist cards

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
      const { displayName, email } = user.value
      await userProfileRef.set({
        gold: 0,
        gems: 0,
        sendCount: 0,
        getCount: 0,
        userName: displayName || email.split('@')[0]
      })
    }
    // Update user profile with username if not already present
    const userProfileData = userProfile.data()
    if (!userProfileData.userName) {
      const { displayName, email } = user.value
      await userProfileRef.update({
        userName: displayName || email.split('@')[0]
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
export function useChat() {
  const messages = ref([]);
  let unsubscribe;

  const loadMessages = async () => {
    try {
      const snapshot = await messagesQuery.get();
      messages.value = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .reverse();

      unsubscribe = messagesQuery.onSnapshot((snapshot) => {
        const newMessages = snapshot.docChanges()
          .filter(change => change.type === 'added')
          .map(change => ({ id: change.doc.id, ...change.doc.data() }))
          .reverse();
        messages.value = [...newMessages, ...messages.value];
      });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  onUnmounted(unsubscribe);
           const naruto = 'https://api.jsonbin.io/v3/b/642c817dc0e7653a059dc7b1';
           const shingeki = 'https://api.jsonbin.io/v3/b/64385b2fc0e7653a05a3bf79';
           const demonslayer ='https://api.jsonbin.io/v3/b/64628da78e4aa6225e9dadc2';
           //const fefates = 'https://api.jsonbin.io/v3/b/63f927aeebd26539d084bb26/latest';
           const cards = [];
           
           Promise.all([
             fetch(naruto).then(response => response.json()),
             fetch(shingeki).then(response => response.json()),
             fetch(demonslayer).then(response => response.json())
           ])
             .then(data => {
               // Concatenate the character arrays from both sources
              // cards.push(...data[0].record.characters);
               cards.push(...data[0].record.characters, ...data[1].record.characters, ...data[2].record.characters);
               console.log(cards); // log the merged array to the console
             })
             .catch(error => {
               console.error(error);
             });
        
           const { user, isLogin } = useAuth()
           const rarities = {
  common: 60,         // 1/21 chance
  uncommon: 22,       // 2/21 chance
  rare: 9,           // 4/21 chance
  'super-rare': 6,   // 6/21 chance
  epic: 2,           // 7/21 chance
  legendary: 1       // 1/21 chance
};

const sendMessage = image => {
  if (!isLogin.value) return;
    const userDocRef = firestore.collection('userProfiles').doc(user.value.uid);
    const now = Date.now();
    userDocRef.get().then(doc => {
      if (doc.exists) {
      const sendCount = doc.data().sendCount || 0;
      const sendAvaliable = doc.data().sendAvaliable || 0;
      if (now < sendAvaliable) {
        const waitTimeInMs = sendAvaliable - now;
        const waitTimeInMin = Math.ceil(waitTimeInMs / 1000 / 60);
        alert(`You can't send a message yet. Please wait ${waitTimeInMin} minute(s).`);
        return;
      }
      const twoMinuteInMs = 2 * 60 * 1000;
      const sendAvaliableNew = now + twoMinuteInMs;
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
        const { cardName, cardSerie, image: cardImg } = card;
        const message = {
          cardName: card.name,
          cardImg: card.image,
          cardSerie: card.serie,
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
            userDocRef.update({
              sendAvaliable: sendAvaliableNew,
              sendCount: sendCount + 1,
              lastsendTime: now
            });
          })
           .catch(error => console.error(`Error adding message: ${error}`));
      });
    } else {
      userDocRef.set({ sendCount: 1 });
    }
  });
};
      
          
          const getCard = (message) => {
            const { uid, displayName } = user.value;
          
            const userDocRef = firestore.collection('userProfiles').doc(uid);
            userDocRef.get().then((doc) => {
              if (doc.exists) {
                const userProfile = doc.data();
                const agora = Date.now()
                if (userProfile.grabAvaliable >= agora) {
                  console.error('Error: no grabAvaliable left');                 
                  return;
                }
          
                const gold = getCardGold(message.rarity);
          
                let frameImgSrc = "";
                switch (message.rarity) {
                  case 'legendary':
                    frameImgSrc = "https://res.cloudinary.com/dzclslnk5/image/upload/assets/frame-legendary.png";
                    break;
                  case 'epic':
                    frameImgSrc = "https://res.cloudinary.com/dzclslnk5/image/upload/assets/epic-frame.png";
                    break;
                  case 'super-rare':
                    frameImgSrc = "https://res.cloudinary.com/dzclslnk5/image/upload/assets/super-rare-frame.png";
                    break;
                  case 'rare':
                    frameImgSrc = "https://res.cloudinary.com/dzclslnk5/image/upload/assets/rare-frame.png";
                    break;
                  case 'uncommon':
                    frameImgSrc = "https://res.cloudinary.com/dzclslnk5/image/upload/assets/uncommon-frame.png";
                    break;
                  default:
                    frameImgSrc = "https://res.cloudinary.com/dzclslnk5/image/upload/assets/frame-common.png";
                    break;
                }
          
                const inventoryItem = {
                  userName: displayName,
                  userId: uid,
                  cardImg: message.cardImg,
                  cardName: message.cardName,
                  cardSerie: message.cardSerie,
                  cardId: message.cardId,
                  rarity: message.rarity,
                  cardFrame: frameImgSrc,
                  burngold: gold,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                };

                cardRef
                  .add(inventoryItem)
                  .then((docRef) => {
                    console.log(`Inventory item written with ID: ${docRef.id}`);
                    const now = Date.now();
                    const timeDiff = userProfile.lastGetTime;
                    const oneMinuteInMs = 60000; // 60 seconds in milliseconds
                    const grabAvaliable = Math.min(now + oneMinuteInMs); // add one minute and ensure it's not in the past
                    userDocRef.update({
                      grabAvaliable,
                      getCount: (userProfile.getCount || 0) + 1,
                      lastGetTime: now
                    });
                  })
                  .catch((error) => {
                    console.error(`Error adding inventory item: ${error}`);
                  });
              } else {
                console.error(`Error: user profile not found`);
              }
            }).catch((error) => {
              console.error(`Error getting user profile or adding inventory item: ${error}`);
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

return { messages, loadMessages, sendMessage, messagesRef, getCard, inventoryRef };
}
export const currentUser = auth.user;