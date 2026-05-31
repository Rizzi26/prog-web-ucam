<?php

declare(strict_types=1);

require_once __DIR__ . '/../../src/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed.', 405);
}

if (!is_logged_in()) {
    json_error('You must be logged in to place an order.', 401);
}

$input = read_input();

if (!csrf_verify($input['csrf_token'] ?? null)) {
    json_error('Invalid CSRF token.', 419);
}

$address = clean_string($input['address'] ?? '');
$payment = clean_string($input['payment_method'] ?? '');

if ($address === '' || $payment === '') {
    json_error('Address and payment method are required.');
}

$cart = $_SESSION['cart'] ?? [];
if (empty($cart)) {
    json_error('Your cart is empty.');
}

$items = [];
foreach ($cart as $variantId => $qty) {
    $variant = Product::findVariant((int) $variantId);
    if ($variant === null) {
        continue;
    }
    $product = Product::find((int) $variant['product_id']);
    if ($product === null) {
        continue;
    }
    $items[] = [
        'variant_id' => (int) $variantId,
        'quantity'   => (int) $qty,
        'unit_price' => (float) $product['price'],
    ];
}

if (empty($items)) {
    json_error('Your cart is empty.');
}

try {
    $result = Order::place(current_user_id(), $items, $address, $payment);
    $_SESSION['cart'] = [];
    json_ok($result);
} catch (RuntimeException $e) {
    json_error($e->getMessage(), 409);
} catch (Throwable $e) {
    json_error('Could not process the order.', 500);
}
