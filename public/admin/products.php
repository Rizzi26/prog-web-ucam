<?php
require_once __DIR__ . '/../../src/bootstrap.php';
require_admin();
$pageTitle = 'Manage Products';
$basePath = '../';
require __DIR__ . '/../partials/header.php';

$products = Product::all();
?>
    <main class="main-content">
        <section class="section">
            <h2 class="section__title">Products &amp; Stock</h2>

            <h3>Add product</h3>
            <form id="productCreateForm" class="admin-form">
                <input type="text" name="name" placeholder="Name" required>
                <input type="text" name="description" placeholder="Description">
                <input type="number" name="price" placeholder="Price" step="0.01" min="0" required>
                <input type="text" name="image" placeholder="Image file (e.g. camisa_preta.jpg)">
                <button type="submit" class="product-card__button">Create</button>
            </form>
            <output id="adminMessage" class="admin-message"></output>

            <h3 style="margin-top:2rem;">Existing products</h3>
            <table class="data-table">
                <thead>
                    <tr><th>ID</th><th>Name</th><th>Price</th><th>Active</th><th>Stock (variants)</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $p): ?>
                        <tr data-product-id="<?= (int) $p['id'] ?>">
                            <td><?= (int) $p['id'] ?></td>
                            <td><?= e($p['name']) ?></td>
                            <td>€ <?= number_format((float) $p['price'], 2) ?></td>
                            <td><?= $p['active'] ? 'Yes' : 'No' ?></td>
                            <td>
                                <?php foreach (Product::variants((int) $p['id']) as $v): ?>
                                    <div class="variant-row" data-variant-id="<?= (int) $v['id'] ?>">
                                        <?= e($v['size']) ?>/<?= e($v['color']) ?>:
                                        <input type="number" class="variant-stock" value="<?= (int) $v['stock_qty'] ?>" min="0" style="width:70px;">
                                        <button class="variant-save-btn" type="button">Save</button>
                                        <button class="variant-delete-btn" type="button">✕</button>
                                    </div>
                                <?php endforeach; ?>
                                <form class="variant-add-form" data-product-id="<?= (int) $p['id'] ?>" style="margin-top:6px;">
                                    <input type="text" name="size" placeholder="Size" required style="width:60px;">
                                    <input type="text" name="color" placeholder="Color" required style="width:80px;">
                                    <input type="number" name="stock_qty" placeholder="Qty" min="0" required style="width:60px;">
                                    <button type="submit">+ variant</button>
                                </form>
                            </td>
                            <td>
                                <button class="product-delete-btn product-card__button" type="button" style="background:#c0392b;">Delete</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </section>
    </main>

    <script src="<?= e($basePath) ?>vendor/jquery.min.js"></script>
    <script src="<?= e($basePath) ?>js/app.js"></script>
    <script src="<?= e($basePath) ?>js/admin.js"></script>
</body>
</html>
