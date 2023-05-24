import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
  state: () => ({
    obtainedCards: [],
  }),
  actions: {
    addObtainedCard(card) {
      this.obtainedCards.push(card);
    },
  },
});
