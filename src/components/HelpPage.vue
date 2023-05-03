
<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-lg-6">
        <h1 class="text-danger center-text">How to Play</h1>
        <p class="lead">Welcome to <span style="color: #831714">Gatcha Game</span>! Here are some instructions to get you started:</p>
        <ul class="list-unstyled">
          <li>Press the "Drop" button to receive 3 cards. You can only do this once every 15 minutes.</li>
          <li>Each drop contains 3 random cards. Other players can grab one of these cards before you if they're fast enough!</li>
          <li>If you miss out on a card, don't worry! You can buy an extra grab to get another chance.</li>
          <li>You can also buy an extra drop to reset your cooldown.</li>
          <li>If you want to change the color of your card frames, click the icon <img   src="https://cdn.leonardo.ai/users/0d68a1c1-1a37-44c4-98dc-43ed5fda9265/generations/558b923d-8e03-4c5b-a1d3-b857276b9e74/variations/Default_a_magic_potion_colors_in_one_bottle_glass_flask_render_1_558b923d-8e03-4c5b-a1d3-b857276b9e74_0.png" width="24" alt=""> on the top-right corner of the card in your inventory.</li>
          <li>You can sell your cards to the game for gold or sell them on the market to other players.</li>
        </ul>
      </div>
      <div class="col-lg-6">
        <h1 class="text-danger">Frequently Asked Questions</h1>
        <div class="accordion" id="faq-accordion">
          <div class="accordion-item">
            <h2 class="accordion-header" id="faq-heading-1">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-collapse-1" aria-expanded="false" aria-controls="faq-collapse-1">
                How do I buy an extra grab or drop?
              </button>
            </h2>
            <div id="faq-collapse-1" class="accordion-collapse collapse" aria-labelledby="faq-heading-1" data-bs-parent="#faq-accordion">
              <div class="accordion-body">You can buy extra grabs and drops in the shop. Just click on the "Shop" button in the main menu.</div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="faq-heading-2">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-collapse-2" aria-expanded="false" aria-controls="faq-collapse-2">
                How do I sell cards on the market?
              </button>
            </h2>
            <div id="faq-collapse-2" class="accordion-collapse collapse" aria-labelledby="faq-heading-2" data-bs-parent="#faq-accordion">
              <div class="accordion-body">To sell cards on the market, go to your inventory and select the card you want to sell. Click on the "Sell" button and set your price. Other players can then buy your card from the market.</div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="faq-heading-3">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-collapse-3" aria-expanded="false" aria-controls="faq-collapse-3">
                How do I change the color of my card frames?
              </button>
            </h2>
            <div id="faq-collapse-3" class="accordion-collapse collapse" aria-labelledby="faq-heading-3" data-bs-parent="#faq--accordion">
<div class="accordion-body">To change the color of your card frames, click the icon on the top right corner icon  <img   src="https://cdn.leonardo.ai/users/0d68a1c1-1a37-44c4-98dc-43ed5fda9265/generations/558b923d-8e03-4c5b-a1d3-b857276b9e74/variations/Default_a_magic_potion_colors_in_one_bottle_glass_flask_render_1_558b923d-8e03-4c5b-a1d3-b857276b9e74_0.png" width="16" alt="">
 of the card in your inventory. A color wheel will appear, allowing you to select a new hue for your frames.</div>
</div>
</div>
<div class="accordion-item">
<h2 class="accordion-header" id="faq-heading-4">
<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-collapse-4" aria-expanded="false" aria-controls="faq-collapse-4">
How can I earn gold currency?
</button>
</h2>
<div id="faq-collapse-4" class="accordion-collapse collapse" aria-labelledby="faq-heading-4" data-bs-parent="#faq-accordion">
<div class="accordion-body">You can earn gold currency by selling your cards to the game or by selling them on the market. You can also receive gold as rewards for completing quests or participating in events.</div>
</div>
</div>
</div>
</div>
</div>

  </div>
</template>
   

<script>
export default {
  name: 'HelpPage',
};
</script>

<style>
/* Add any necessary styles here */
</style>
