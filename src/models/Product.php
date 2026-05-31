<?php

declare(strict_types=1);

final class Product
{
    public static function catalog(string $search = ''): array
    {
        $sql = 'SELECT p.*, COALESCE(SUM(v.stock_qty), 0) AS total_stock
                FROM products p
                LEFT JOIN product_variants v ON v.product_id = p.id
                WHERE p.active = 1';
        $params = [];

        if ($search !== '') {
            $sql .= ' AND (p.name LIKE ? OR p.description LIKE ?)';
            $like = '%' . $search . '%';
            $params[] = $like;
            $params[] = $like;
        }

        $sql .= ' GROUP BY p.id ORDER BY p.name';

        $stmt = Database::connection()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function all(): array
    {
        return Database::connection()
            ->query('SELECT * FROM products ORDER BY name')
            ->fetchAll();
    }

    public static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM products WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(string $name, ?string $description, float $price, ?string $image, int $active = 1): int
    {
        $stmt = Database::connection()->prepare(
            'INSERT INTO products (name, description, price, image, active) VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([$name, $description, $price, $image, $active]);
        return (int) Database::connection()->lastInsertId();
    }

    public static function update(int $id, string $name, ?string $description, float $price, ?string $image, int $active): void
    {
        $stmt = Database::connection()->prepare(
            'UPDATE products SET name = ?, description = ?, price = ?, image = ?, active = ? WHERE id = ?'
        );
        $stmt->execute([$name, $description, $price, $image, $active, $id]);
    }

    public static function delete(int $id): void
    {
        $stmt = Database::connection()->prepare('DELETE FROM products WHERE id = ?');
        $stmt->execute([$id]);
    }

    public static function variants(int $productId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM product_variants WHERE product_id = ? ORDER BY size'
        );
        $stmt->execute([$productId]);
        return $stmt->fetchAll();
    }

    public static function findVariant(int $variantId): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM product_variants WHERE id = ? LIMIT 1'
        );
        $stmt->execute([$variantId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function addVariant(int $productId, string $size, string $color, int $stock): int
    {
        $stmt = Database::connection()->prepare(
            'INSERT INTO product_variants (product_id, size, color, stock_qty) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$productId, $size, $color, $stock]);
        return (int) Database::connection()->lastInsertId();
    }

    public static function updateStock(int $variantId, int $stock): void
    {
        $stmt = Database::connection()->prepare(
            'UPDATE product_variants SET stock_qty = ? WHERE id = ?'
        );
        $stmt->execute([$stock, $variantId]);
    }

    public static function deleteVariant(int $variantId): void
    {
        $stmt = Database::connection()->prepare('DELETE FROM product_variants WHERE id = ?');
        $stmt->execute([$variantId]);
    }

    public static function decrementStock(int $variantId, int $qty): bool
    {
        $stmt = Database::connection()->prepare(
            'UPDATE product_variants SET stock_qty = stock_qty - ?
             WHERE id = ? AND stock_qty >= ?'
        );
        $stmt->execute([$qty, $variantId, $qty]);
        return $stmt->rowCount() > 0;
    }
}
