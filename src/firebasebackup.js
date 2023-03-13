// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';


// import { ref, onUnmounted, computed } from 'vue'

// // Replace with your own Firebase config
// const firebaseConfig = {
//    apiKey: "AIzaSyALxDocM3rzVBaDHZQZ3i5zIJt3klJqH-o",
//   authDomain: "card-colect.firebaseapp.com",
//   projectId: "card-colect",
//   storageBucket: "card-colect.appspot.com",
//   messagingSenderId: "1065828021976",
//   appId: "1:1065828021976:web:eb3ec67726cd9f8b6849ad"
// };

// firebase.initializeApp(firebaseConfig);

// export const auth = firebase.auth();
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

// export const firestore = firebase.firestore()
// const messagesCollection = firestore.collection('messages')
// const messagesRef = firebase.firestore().collection("messages");
// const cardRef = firebase.firestore().collection("inventory");
// const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100)


// export function useChat() {
//   const messages = ref([])
//   const unsubscribe = messagesQuery.onSnapshot(snapshot => {
//     messages.value = snapshot.docs
//       .map(doc => ({ id: doc.id, ...doc.data() }))
//       .reverse()
//   })
//   onUnmounted(unsubscribe)
//   const cards = []
//   fetch('https://api.jsonbin.io/v3/b/63f927aeebd26539d084bb26/latest')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data.record.characters); // log the data object to the console
//     cards.push(...data.record.characters);
//   })
//   .catch(error => {
//     console.error(error);
//   });

//   const { user, isLogin } = useAuth()
//   const sendMessage = image => {
//     if (!isLogin.value) return
//     const selectedCards = [];
// while (selectedCards.length < 3) {
//   const card = cards[Math.floor(Math.random() * cards.length)];
//   if (!selectedCards.includes(card)) {
//     selectedCards.push(card);
//   }
// }
// const { photoURL, uid, displayName } = user.value
//     selectedCards.forEach(card => {
//       const message = {
//         cardName: card.name,
//         cardImgUrl: card.image,
//         userName: displayName,
//         userId: uid,
//         userPhotoURL: photoURL,
//         createdAt: firebase.firestore.FieldValue.serverTimestamp()
//       };
//       messagesRef.add(message)
//         .then(docRef => console.log(`Message written with ID: ${docRef.id}`))
//         .catch(error => console.error(`Error adding message: ${error}`));
//     });
//     // const { photoURL, uid, displayName } = user.value
//     // messagesCollection.add({
//     //   userName: displayName,
//     //   userId: uid,
//     //   userPhotoURL: photoURL,
//     //   imgUrl: image,
//     //   createdAt: firebase.firestore.FieldValue.serverTimestamp()
//     // })
//   }

//   return { messages, sendMessage, messagesRef }
// }
// export const currentUser = auth.user;