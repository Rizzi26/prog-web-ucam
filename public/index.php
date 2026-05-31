<?php
$pageTitle = 'T-Shirt Store';
require __DIR__ . '/partials/header.php';

$products = Product::catalog();
?>

    <main class="main-content">

        <section id="catalog" class="section catalog">
            <h2 class="section__title">Our T-Shirts</h2>
            <div class="catalog__grid" id="catalogGrid">
                <?php foreach ($products as $product): ?>
                    <?php $variants = Product::variants((int) $product['id']); ?>
                    <article class="product-card" data-name="<?= e($product['name']) ?>">
                        <img src="assets/<?= e($product['image']) ?>" alt="<?= e($product['name']) ?>" class="product-card__img">
                        <h3 class="product-card__title"><?= e($product['name']) ?></h3>
                        <p class="product-card__price">€ <?= number_format((float) $product['price'], 2) ?></p>

                        <?php if (empty($variants)): ?>
                            <p style="color:#c0392b; font-size:0.85rem;">Out of stock</p>
                        <?php else: ?>
                            <label style="display:block; font-size:0.85rem; margin-bottom:6px;">
                                Size
                                <select class="variant-select" style="width:100%; padding:4px;">
                                    <?php foreach ($variants as $v): ?>
                                        <option value="<?= (int) $v['id'] ?>" <?= $v['stock_qty'] <= 0 ? 'disabled' : '' ?>>
                                            <?= e($v['size']) ?> · <?= e($v['color']) ?>
                                            (<?= (int) $v['stock_qty'] ?> in stock)
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </label>
                            <button class="product-card__button add-to-cart-btn">Add to Cart</button>
                        <?php endif; ?>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>

        <section id="events" class="section events">
            <h2 class="section__title">Promotions Calendar</h2>
            <div class="calendar" id="promoCalendar">
                <p>The calendar will be rendered here.</p>
            </div>
        </section>

        <section id="pickup" class="section location">
            <h2 class="section__title">Find the nearest store</h2>
            <p class="location__desc">Allow location access so we can find the ideal pickup point for you.</p>
            <button id="btnLocation" class="location__button">Use my location</button>
            <output id="locationResult" class="location__result"></output>
        </section>

        <section id="links" class="section">
            <h2 class="section__title">Useful Links</h2>
            <ul style="list-style: disc; padding-left: 1.5rem; line-height: 2;">
                <li><a href="https://www.ucam.edu" target="_blank" rel="noopener">UCAM - Universidad Católica de Murcia</a></li>
                <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener">MDN - HTML5 Reference</a></li>
                <li><a href="account.php">My orders &amp; invoices</a></li>
            </ul>
        </section>

        <dialog id="cartModal" class="cart-modal" style="display: none;">
            <div class="cart-modal__content">
                <button class="cart-modal__close" id="closeCartBtn" aria-label="Close cart" style="background: none; border: none; font-size: inherit; cursor: pointer;">&times;</button>
                <h2>Your Cart</h2>
                <ul id="cartItemsList"></ul>
                <footer class="cart-modal__footer">
                    <p><strong>Total: <span id="cartTotal">€ 0.00</span></strong></p>
                    <button class="cart-modal__checkout" id="goCheckoutBtn">Checkout</button>
                </footer>
            </div>
        </dialog>
    </main>

<?php require __DIR__ . '/partials/footer.php'; ?>
