import { useStore } from './store';

export default {
  setup() {
    const store = useStore();

    // Access store state
    const obtainedCard = computed(() => store.obtainedCard);

    // Access store actions
    const addObtainedCard = (card) => store.addObtainedCard(card);

    // ...

    return {
      obtainedCard,
      addObtainedCard,
      // ...
    };
  },
  // ...
};
