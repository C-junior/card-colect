import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { nanoid } from 'nanoid';


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
// export function useAuth() {
//     const user = ref(null)
//     const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))
//     onUnmounted(unsubscribe)
//     const isLogin = computed(() => user.value !== null)
  
//     const signIn = async () => {
//       const googleProvider = new firebase.auth.GoogleAuthProvider()
//       await auth.signInWithPopup(googleProvider)
//     }
//     const signOut = () => auth.signOut()
  
//     return { user, isLogin, signIn, signOut }
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
const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100)
const invetoryQuery = inventoryCollection.orderBy('createdAt', 'desc')

export function useChat() {
  const messages = ref([])
 const unsubscribe = messagesQuery.onSnapshot(snapshot => {
            messages.value = snapshot.docs
               .map(doc => ({ id: doc.id, ...doc.data() }))
               .reverse()
           })
          
           onUnmounted(unsubscribe)
           const cards = []
           fetch('https://api.jsonbin.io/v3/b/63f927aeebd26539d084bb26/latest')
           .then(response => response.json())
           .then(data => {
             console.log(data.record.characters); // log the data object to the console
             cards.push(...data.record.characters);
           })
           .catch(error => {
             console.error(error);
           });
        
           const { user, isLogin } = useAuth()
          const sendMessage = image => {
  if (!isLogin.value) return;
  const selectedCards = [];
  while (selectedCards.length < 3) {
    const card = cards[Math.floor(Math.random() * cards.length)];
    if (!selectedCards.includes(card)) {
      selectedCards.push(card);
    }
  }
  const { photoURL, uid, displayName } = user.value;
  selectedCards.forEach(card => {
    const message = {
      cardName: card.name,
      cardImg: card.image,
      cardId: nanoid(8),
      userName: displayName,
      image: image,
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
           const getCard = (message) => {
            const { photoURL, uid, displayName } = user.value;
            if (!message.cardImg) {
              console.error(`Error: card ${message.cardName} does not have a valid image`);
              return;
            }
            const inventoryItem = {    
              userName: displayName,
              userId: uid,
              userPhotoURL: photoURL,
              cardImg: message.cardImg,
              cardName: message.cardName,
              cardId: message.cardId,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };
            
            cardRef
              .add(inventoryItem)
              .then((docRef) => {
                console.log(`Inventory item written with ID: ${docRef.id}`);
                const userDocRef = firestore.collection('userProfiles').doc(uid)
                userDocRef.get().then(
                  doc =>{
                    if(doc.exists) {
                      const getCount = doc.data().getCount || 0
                      userDocRef.update({ getCount: getCount + 1})
                    } else {
                      userDocRef.set({getCount: 1})
                    }
                  }
                )
                .catch(error => console.error(`Error adding message: ${error}`));
                return docRef.id; // Return the ID of the new inventory item
              })
              .catch((error) => {
                console.error(`Error adding inventory item: ${error}`);
                return null; // Return null if there was an error
              });
          };
          
const inventoryRef = firebase.firestore().collection('inventory');

  return { messages, sendMessage, messagesRef, getCard, inventoryRef };
}
export const currentUser = auth.user;