<?php
require_once __DIR__ . '/../src/bootstrap.php';
require_login();
$pageTitle = 'My Account';
require __DIR__ . '/partials/header.php';

$orders = Order::forUser((int) current_user_id());
?>
    <main class="main-content">
        <section class="section">
            <h2 class="section__title">My Orders</h2>

            <?php if (empty($orders)): ?>
                <p>You have no orders yet. <a href="index.php">Start shopping</a>.</p>
            <?php else: ?>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Invoice</th><th>Date</th><th>Items</th><th>Status</th><th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($orders as $order): ?>
                            <?php $items = Order::items((int) $order['id']); ?>
                            <tr>
                                <td><?= e($order['invoice_number'] ?? '-') ?></td>
                                <td><?= e($order['created_at']) ?></td>
                                <td>
                                    <?php foreach ($items as $it): ?>
                                        <?= (int) $it['quantity'] ?>× <?= e($it['product_name']) ?>
                                        (<?= e($it['size']) ?>/<?= e($it['color']) ?>)<br>
                                    <?php endforeach; ?>
                                </td>
                                <td><?= e($order['status']) ?></td>
                                <td>€ <?= number_format((float) $order['total'], 2) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </section>
    </main>
<?php require __DIR__ . '/partials/footer.php'; ?>
