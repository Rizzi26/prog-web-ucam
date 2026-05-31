<?php
require_once __DIR__ . '/../../src/bootstrap.php';
$pageTitle = $pageTitle ?? 'T-Shirt Store';
$basePath = $basePath ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?= e(csrf_token()) ?>">
    <meta name="base-path" content="<?= e($basePath) ?>">
    <title><?= e($pageTitle) ?> | UCAM</title>
    <link rel="stylesheet" href="<?= e($basePath) ?>css/reset.css">
    <link rel="stylesheet" href="<?= e($basePath) ?>css/style.css">
    <link rel="stylesheet" href="<?= e($basePath) ?>css/admin.css">
</head>
<body class="page">

    <header class="header">
        <div class="header__logo-container">
            <canvas id="logoCanvas" width="80" height="80" aria-label="T-Shirt Store Logo: A minimalist hanger"></canvas>
            <h1 class="header__title"><a href="<?= e($basePath) ?>index.php" style="color: inherit; text-decoration: none;">T-Shirt Store</a></h1>
        </div>

        <search class="header__search">
            <input type="search" id="searchInput" class="search__input" placeholder="Search t-shirts...">
            <button class="search__button" type="button">Search</button>
        </search>

        <div class="header__actions" style="display: flex; align-items: center; gap: 15px;">
            <button class="header__cart" id="cartBtn" style="cursor: pointer; background: transparent; border: none; font-size: inherit; color: inherit; padding: 0;">
                <span class="cart__icon">🛒</span>
                <span class="cart__count" id="cartCount">0</span> items
            </button>
        </div>
    </header>

    <nav class="nav">
        <ul class="nav__list">
            <li class="nav__item"><a href="<?= e($basePath) ?>index.php" class="nav__link">Catalog</a></li>
            <li class="nav__item"><a href="<?= e($basePath) ?>index.php#events" class="nav__link">Events</a></li>
            <li class="nav__item"><a href="<?= e($basePath) ?>index.php#pickup" class="nav__link">Pickup Points</a></li>
            <?php if (is_logged_in()): ?>
                <li class="nav__item"><a href="<?= e($basePath) ?>account.php" class="nav__link">My Account</a></li>
                <?php if (is_admin()): ?>
                    <li class="nav__item"><a href="<?= e($basePath) ?>admin/index.php" class="nav__link">Admin</a></li>
                <?php endif; ?>
                <li class="nav__item"><a href="<?= e($basePath) ?>logout.php" class="nav__link">Logout (<?= e($_SESSION['name'] ?? '') ?>)</a></li>
            <?php else: ?>
                <li class="nav__item"><a href="<?= e($basePath) ?>login.php" class="nav__link">Login</a></li>
                <li class="nav__item"><a href="<?= e($basePath) ?>register.php" class="nav__link">Register</a></li>
            <?php endif; ?>
        </ul>
    </nav>
