<?php
$pageTitle = 'Register';
require __DIR__ . '/partials/header.php';
?>
    <main class="main-content" style="max-width: 480px;">
        <section class="section">
            <h2 class="section__title">Create account</h2>
            <form id="registerForm">
                <p style="margin-bottom: 1rem;">
                    <label>Name<br>
                        <input type="text" name="name" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px;">
                    </label>
                </p>
                <p style="margin-bottom: 1rem;">
                    <label>Email<br>
                        <input type="email" name="email" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px;">
                    </label>
                </p>
                <p style="margin-bottom: 1rem;">
                    <label>Password (min. 6 chars)<br>
                        <input type="password" name="password" required minlength="6" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px;">
                    </label>
                </p>
                <output id="authMessage" style="display:block; margin-bottom:1rem; color:#c0392b;"></output>
                <button type="submit" class="cart-modal__checkout">Register</button>
            </form>
            <p style="margin-top:1rem; font-size:0.9rem;">Already registered? <a href="login.php">Sign in</a>.</p>
        </section>
    </main>
<?php $extraScripts = ['js/auth.js']; require __DIR__ . '/partials/footer.php'; ?>
