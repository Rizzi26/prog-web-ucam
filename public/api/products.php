<?php

declare(strict_types=1);

require_once __DIR__ . '/../../src/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $search = clean_string($_GET['q'] ?? '');
    json_ok(['products' => Product::catalog($search)]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed.', 405);
}

if (!is_admin()) {
    json_error('Forbidden.', 403);
}

$input = read_input();

if (!csrf_verify($input['csrf_token'] ?? null)) {
    json_error('Invalid CSRF token.', 419);
}

$action = $input['action'] ?? '';

switch ($action) {
    case 'create':
        $name  = clean_string($input['name'] ?? '');
        $price = to_decimal($input['price'] ?? null);
        if ($name === '' || $price === null) {
            json_error('Name and a numeric price are required.');
        }
        $id = Product::create(
            $name,
            clean_string($input['description'] ?? ''),
            $price,
            clean_string($input['image'] ?? '') ?: null,
            (int) ($input['active'] ?? 1)
        );
        json_ok(['id' => $id]);
        break;

    case 'update':
        $id    = to_int($input['id'] ?? null);
        $name  = clean_string($input['name'] ?? '');
        $price = to_decimal($input['price'] ?? null);
        if ($id === null || $name === '' || $price === null) {
            json_error('Id, name and a numeric price are required.');
        }
        Product::update(
            $id,
            $name,
            clean_string($input['description'] ?? ''),
            $price,
            clean_string($input['image'] ?? '') ?: null,
            (int) ($input['active'] ?? 1)
        );
        json_ok();
        break;

    case 'delete':
        $id = to_int($input['id'] ?? null);
        if ($id === null) {
            json_error('Product id is required.');
        }
        Product::delete($id);
        json_ok();
        break;

    case 'add_variant':
        $productId = to_int($input['product_id'] ?? null);
        $size      = clean_string($input['size'] ?? '');
        $color     = clean_string($input['color'] ?? '');
        $stock     = to_int($input['stock_qty'] ?? null);
        if ($productId === null || $size === '' || $color === '' || $stock === null) {
            json_error('Product, size, color and stock are required.');
        }
        $vid = Product::addVariant($productId, $size, $color, $stock);
        json_ok(['id' => $vid]);
        break;

    case 'update_stock':
        $variantId = to_int($input['variant_id'] ?? null);
        $stock     = to_int($input['stock_qty'] ?? null);
        if ($variantId === null || $stock === null) {
            json_error('Variant and stock are required.');
        }
        Product::updateStock($variantId, $stock);
        json_ok();
        break;

    case 'delete_variant':
        $variantId = to_int($input['variant_id'] ?? null);
        if ($variantId === null) {
            json_error('Variant id is required.');
        }
        Product::deleteVariant($variantId);
        json_ok();
        break;

    default:
        json_error('Unknown action.');
}
