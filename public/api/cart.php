<?php

declare(strict_types=1);

require_once __DIR__ . '/../../src/bootstrap.php';

if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

function cart_view(): array
{
    $items = [];
    $total = 0.0;

    foreach ($_SESSION['cart'] as $variantId => $qty) {
        $variant = Product::findVariant((int) $variantId);
        if ($variant === null) {
            continue;
        }
        $product = Product::find((int) $variant['product_id']);
        if ($product === null) {
            continue;
        }
        $price = (float) $product['price'];
        $subtotal = $price * $qty;
        $total += $subtotal;

        $items[] = [
            'variant_id' => (int) $variantId,
            'name'       => $product['name'],
            'size'       => $variant['size'],
            'color'      => $variant['color'],
            'price'      => $price,
            'quantity'   => $qty,
            'subtotal'   => $subtotal,
        ];
    }

    return ['items' => $items, 'total' => $total, 'count' => array_sum($_SESSION['cart'])];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_ok(cart_view());
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed.', 405);
}

$input = read_input();

if (!csrf_verify($input['csrf_token'] ?? null)) {
    json_error('Invalid CSRF token.', 419);
}

$action = $input['action'] ?? '';

switch ($action) {
    case 'add':
        $variantId = to_int($input['variant_id'] ?? null);
        $qty       = max(1, (int) ($input['quantity'] ?? 1));
        if ($variantId === null || Product::findVariant($variantId) === null) {
            json_error('Invalid product variant.');
        }
        $_SESSION['cart'][$variantId] = ($_SESSION['cart'][$variantId] ?? 0) + $qty;
        json_ok(cart_view());
        break;

    case 'remove':
        $variantId = to_int($input['variant_id'] ?? null);
        if ($variantId !== null) {
            unset($_SESSION['cart'][$variantId]);
        }
        json_ok(cart_view());
        break;

    case 'clear':
        $_SESSION['cart'] = [];
        json_ok(cart_view());
        break;

    default:
        json_error('Unknown action.');
}
