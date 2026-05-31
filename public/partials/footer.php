    <footer class="footer">
        <div class="footer__info">
            <p>&copy; 2026 T-Shirt Store.</p>
            <p>Web Programming Project - UCAM (2025/2026)</p>
            <p>Developed by: Marco &amp; Otto</p>
        </div>
    </footer>

    <script src="<?= e($basePath ?? '') ?>vendor/jquery.min.js"></script>
    <script src="<?= e($basePath ?? '') ?>js/app.js"></script>
    <?php foreach (($extraScripts ?? []) as $script): ?>
        <script src="<?= e($basePath ?? '') ?><?= e($script) ?>"></script>
    <?php endforeach; ?>
</body>
</html>
