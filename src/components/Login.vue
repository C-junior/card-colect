<template>
   <div class="btn-sign">
   
    <div v-if="isLogin" class="login">
    <button class="btn btn-outline-danger" @click="signOut" > SignOut</button>
    </div>
    <div v-else >
        <button class="btn btn-outline-danger" @click="signIn">SignIn</button>    
    </div>
</div>
    </template>
    <script>
       import { useAuth, currentUser} from '@/firebase'


       export default {
        setup() {
            const { user, isLogin, signOut, signIn, currentUser } = useAuth()
            
            return  { user, isLogin, signOut, signIn, currentUser }
        },               
       }
      
    </script>

    <style scoped>
        *{
            text-align:center;
            margin: 5px;
        }
        .btn-sign {
            width: 89%;
            display: flex;
            justify-content: end;
        }
    </style>