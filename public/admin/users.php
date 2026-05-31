<?php
require_once __DIR__ . '/../../src/bootstrap.php';
require_admin();
$pageTitle = 'Manage Users';
$basePath = '../';
require __DIR__ . '/../partials/header.php';

$users = User::all();
$selfId = (int) current_user_id();
?>
    <main class="main-content">
        <section class="section">
            <h2 class="section__title">User Administration</h2>
            <output id="adminMessage" class="admin-message"></output>

            <table class="data-table">
                <thead>
                    <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Registered</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    <?php foreach ($users as $u): ?>
                        <tr data-user-id="<?= (int) $u['id'] ?>">
                            <td><?= (int) $u['id'] ?></td>
                            <td><?= e($u['name']) ?></td>
                            <td><?= e($u['email']) ?></td>
                            <td>
                                <?php if ((int) $u['id'] === $selfId): ?>
                                    <?= e($u['role']) ?> (you)
                                <?php else: ?>
                                    <select class="user-role-select">
                                        <option value="customer" <?= $u['role'] === 'customer' ? 'selected' : '' ?>>customer</option>
                                        <option value="admin" <?= $u['role'] === 'admin' ? 'selected' : '' ?>>admin</option>
                                    </select>
                                <?php endif; ?>
                            </td>
                            <td><?= e($u['created_at']) ?></td>
                            <td>
                                <?php if ((int) $u['id'] !== $selfId): ?>
                                    <button class="user-delete-btn product-card__button" type="button" style="background:#c0392b;">Delete</button>
                                <?php endif; ?>
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
