<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <div class="modal-options">
        <label>
          <input type="radio" v-model="selectedOption" value="option1">
          Option 1
        </label>
        <label>
          <input type="radio" v-model="selectedOption" value="option2">
          Option 2
        </label>
      </div>
      <div class="modal-input">
        <label>Value:</label>
        <input type="number" v-model="value">
      </div>
      <div class="modal-buttons">
        <button class="modal-cancel" @click="cancel">Cancel</button>
        <button class="modal-submit" @click="submit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
// export default {
//   props: {
//     show: {
//       type: Boolean,
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//   },
//   data() {
//     return {
//       selectedOption: null,
//       value: null,
//     };
//   },
//   methods: {
//     cancel() {
//       this.$emit("cancel");
//     },
//     submit() {
//       if (!this.selectedOption || !this.value) {
//         return;
//       }
//       this.$emit("submit", {
//         option: this.selectedOption,
//         value: this.value,
//       });
//     },
//   },
// };
 export default {
   data() {
     return {
       price: 0,
       currency: 'gold',
     }
   },
   props: {
     show: {
       type: Boolean,
       required: true,
     },
     title: {
       type: String,
       required: true,
     },
   },
   watch: {
     show(newValue) {
       if (newValue) {
         this.price = 0;
         this.currency = 'gold';
       }
     },
   },
   methods: {
     cancel() {
       this.$emit("cancel");
     },
     submit() {
       if (!this.selectedOption || !this.value) {
         return;
       }
       this.$emit("submit", {
         option: this.selectedOption,
         value: this.value,
       });
     },
 },
}
</script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
  }
  
  .modal-content {
    background-color: rgb(34, 30, 30);
    border-radius: 5px;
    padding: 20px;
    max-width: 500px;
    margin: 50px auto;
    position: relative;
  }
  
  .modal h2 {
    color: #fff;
    font-size: 1.5rem;
    margin-top: 0;
    background-color: #e50404;
    padding: 15px;
    border-radius: 5px 5px 0 0;
  }
  
  .modal-options {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
  }
  
  .modal-options label {
    margin-right: 10px;
    font-size: 1.2rem;
  }
  
  .modal-options input[type="radio"] {
    margin-right: 5px;
  }
  
  .modal-input {
    margin-bottom: 20px;
  }
  
  .modal-input label {
    font-size: 1.2rem;
  }
  
  .modal-input input[type="number"] {
    width: 100%;
    padding: 10px;
    font-size: 1.2rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
  }
  
  .modal-cancel {
    background-color: rgb(255, 255, 255);
    color: #e50404;
    border: 1px solid #e50404;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 1.2rem;
    cursor: pointer;
    margin-right: 10px;
  }
  
  .modal-submit {
    background-color: #e50404;
    color: #fff;
    border: 1px solid #eeeded;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 1.2rem;
    cursor: pointer;
    margin-right: 10px;
  }
  </style>