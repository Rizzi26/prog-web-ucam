<?php
$pageTitle = 'Login';
require __DIR__ . '/partials/header.php';
?>
    <main class="main-content" style="max-width: 480px;">
        <section class="section">
            <h2 class="section__title">Login</h2>
            <form id="loginForm">
                <p style="margin-bottom: 1rem;">
                    <label>Email<br>
                        <input type="email" name="email" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px;">
                    </label>
                </p>
                <p style="margin-bottom: 1rem;">
                    <label>Password<br>
                        <input type="password" name="password" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px;">
                    </label>
                </p>
                <output id="authMessage" style="display:block; margin-bottom:1rem; color:#c0392b;"></output>
                <button type="submit" class="cart-modal__checkout">Sign in</button>
            </form>
            <p style="margin-top:1rem; font-size:0.9rem;">No account? <a href="register.php">Register here</a>.</p>
        </section>
    </main>
<?php $extraScripts = ['js/auth.js']; require __DIR__ . '/partials/footer.php'; ?>
