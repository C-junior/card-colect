<template>
    <div class="modal" v-if="show">
      <div class="modal-overlay" @click="close"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="close-button" @click="close">&times;</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        default: "Modal Title",
      },
      show: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      close() {
        this.$emit("update:show", false);
      },
    },
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-container {
    position: relative;
    z-index: 1;
    max-width: 600px;
    width: 100%;
    background-color: #fff;
    border-radius: 4px;
    padding: 16px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .close-button {
    font-size: 24px;
    color: #aaa;
    border: none;
    background: none;
    cursor: pointer;
  }
  
  .modal-body {
    margin-top: 16px;
  }
  </style>
  