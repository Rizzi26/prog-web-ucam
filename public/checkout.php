<?php
require_once __DIR__ . '/../src/bootstrap.php';
require_login();
$pageTitle = 'Checkout';
require __DIR__ . '/partials/header.php';
?>
    <main class="main-content" style="max-width: 800px;">
        <section class="section">
            <h2 class="section__title">Complete Order</h2>

            <div id="checkoutSummary" style="margin-bottom: 2rem; padding: 1rem; background: #f9f9f9; border-radius: 8px;">
                <p>Loading your cart...</p>
            </div>

            <form id="checkoutForm">
                <fieldset style="margin-bottom: 2rem; border: none; padding: 0;">
                    <legend style="margin-bottom: 1rem; font-size: 1.17em; font-weight: bold;">📍 Delivery Address</legend>
                    <p style="font-size: 0.9rem; margin-bottom: 10px;">We can use your location to define the ideal delivery point.</p>
                    <button type="button" id="btnGetAddress" class="product-card__button" style="background-color: var(--primary-color);">📍 Use My Current Location</button>
                    <output id="addressResult" style="display: block; margin-top: 10px; font-weight: bold; color: #27ae60;"></output>
                    <input type="text" id="manualAddress" name="address" placeholder="Or enter your address manually..." style="width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #ddd; border-radius: 4px;" required>
                </fieldset>

                <fieldset style="margin-bottom: 2rem; display: flex; flex-direction: column; gap: 10px; border: none; padding: 0;">
                    <legend style="margin-bottom: 1rem; font-size: 1.17em; font-weight: bold;">💳 Payment Method</legend>
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="radio" name="payment" value="apple_pay" required> 🍎 Apple Pay
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="radio" name="payment" value="credit_card"> 💳 Credit Card
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="radio" name="payment" value="bank_slip"> 📄 Bank Slip
                    </label>
                </fieldset>

                <output id="checkoutMessage" style="display:block; margin-bottom:1rem; color:#c0392b;"></output>
                <button type="submit" class="cart-modal__checkout" style="font-size: 1.2rem;">Confirm Order</button>
            </form>
        </section>
    </main>

    <script src="vendor/jquery.min.js"></script>
    <script src="js/app.js"></script>
    <script src="js/checkout.js"></script>
</body>
</html>
