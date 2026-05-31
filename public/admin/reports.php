<?php
require_once __DIR__ . '/../../src/bootstrap.php';
require_admin();
$pageTitle = 'Sales Reports';
$basePath = '../';
require __DIR__ . '/../partials/header.php';

$summary   = Order::salesSummary();
$byProduct = Order::salesByProduct();
$invoices  = Invoice::all();
?>
    <main class="main-content">
        <section class="section">
            <h2 class="section__title">Sales Reports</h2>

            <div class="admin-stats">
                <div class="admin-stat">
                    <span class="admin-stat__value"><?= (int) $summary['order_count'] ?></span>
                    <span class="admin-stat__label">Paid orders</span>
                </div>
                <div class="admin-stat">
                    <span class="admin-stat__value">€ <?= number_format((float) $summary['revenue'], 2) ?></span>
                    <span class="admin-stat__label">Total revenue</span>
                </div>
            </div>

            <h3 style="margin-top:2rem;">Sales by product</h3>
            <table class="data-table">
                <thead><tr><th>Product</th><th>Units sold</th><th>Revenue</th></tr></thead>
                <tbody>
                    <?php if (empty($byProduct)): ?>
                        <tr><td colspan="3">No sales yet.</td></tr>
                    <?php else: ?>
                        <?php foreach ($byProduct as $row): ?>
                            <tr>
                                <td><?= e($row['name']) ?></td>
                                <td><?= (int) $row['units_sold'] ?></td>
                                <td>€ <?= number_format((float) $row['revenue'], 2) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>

            <h3 style="margin-top:2rem;">Invoices</h3>
            <table class="data-table">
                <thead><tr><th>Number</th><th>Customer</th><th>Issued</th><th>Total</th></tr></thead>
                <tbody>
                    <?php if (empty($invoices)): ?>
                        <tr><td colspan="4">No invoices yet.</td></tr>
                    <?php else: ?>
                        <?php foreach ($invoices as $inv): ?>
                            <tr>
                                <td><?= e($inv['number']) ?></td>
                                <td><?= e($inv['customer_name']) ?></td>
                                <td><?= e($inv['issued_at']) ?></td>
                                <td>€ <?= number_format((float) $inv['total'], 2) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </section>
    </main>
<?php require __DIR__ . '/../partials/footer.php'; ?>
