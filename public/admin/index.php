<?php
require_once __DIR__ . '/../../src/bootstrap.php';
require_admin();
$pageTitle = 'Admin Dashboard';
$basePath = '../';
require __DIR__ . '/../partials/header.php';

$summary = Order::salesSummary();
?>
    <main class="main-content">
        <section class="section">
            <h2 class="section__title">Admin Dashboard</h2>
            <p>Welcome, <?= e($_SESSION['name'] ?? 'admin') ?>.</p>

            <div class="admin-stats">
                <div class="admin-stat">
                    <span class="admin-stat__value"><?= (int) $summary['order_count'] ?></span>
                    <span class="admin-stat__label">Paid orders</span>
                </div>
                <div class="admin-stat">
                    <span class="admin-stat__value">€ <?= number_format((float) $summary['revenue'], 2) ?></span>
                    <span class="admin-stat__label">Revenue</span>
                </div>
            </div>

            <nav class="admin-nav">
                <a class="product-card__button" href="products.php">Manage Products &amp; Stock</a>
                <a class="product-card__button" href="users.php">Manage Users</a>
                <a class="product-card__button" href="reports.php">Sales Reports</a>
            </nav>
        </section>
    </main>
<?php require __DIR__ . '/../partials/footer.php'; ?>
