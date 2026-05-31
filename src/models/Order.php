<?php

declare(strict_types=1);

final class Order
{
    public static function place(int $userId, array $items, string $address, string $paymentMethod): array
    {
        $pdo = Database::connection();
        $pdo->beginTransaction();

        try {
            $total = 0.0;
            foreach ($items as $item) {
                $total += $item['unit_price'] * $item['quantity'];
            }

            $stmt = $pdo->prepare(
                'INSERT INTO orders (user_id, status, total, address, payment_method)
                 VALUES (?, ?, ?, ?, ?)'
            );
            $stmt->execute([$userId, 'paid', $total, $address, $paymentMethod]);
            $orderId = (int) $pdo->lastInsertId();

            $itemStmt = $pdo->prepare(
                'INSERT INTO order_items (order_id, variant_id, quantity, unit_price)
                 VALUES (?, ?, ?, ?)'
            );

            foreach ($items as $item) {
                if (!Product::decrementStock((int) $item['variant_id'], (int) $item['quantity'])) {
                    throw new RuntimeException('Insufficient stock for one of the items.');
                }
                $itemStmt->execute([
                    $orderId,
                    $item['variant_id'],
                    $item['quantity'],
                    $item['unit_price'],
                ]);
            }

            $invoice = Invoice::issue($orderId, $total);

            $pdo->commit();

            return [
                'order_id'       => $orderId,
                'invoice_number' => $invoice['number'],
                'total'          => $total,
            ];
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public static function forUser(int $userId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT o.*, i.number AS invoice_number
             FROM orders o
             LEFT JOIN invoices i ON i.order_id = o.id
             WHERE o.user_id = ?
             ORDER BY o.created_at DESC'
        );
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public static function items(int $orderId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT oi.*, p.name AS product_name, v.size, v.color
             FROM order_items oi
             JOIN product_variants v ON v.id = oi.variant_id
             JOIN products p ON p.id = v.product_id
             WHERE oi.order_id = ?'
        );
        $stmt->execute([$orderId]);
        return $stmt->fetchAll();
    }

    public static function salesSummary(): array
    {
        return Database::connection()->query(
            "SELECT
                COUNT(*)                AS order_count,
                COALESCE(SUM(total), 0) AS revenue
             FROM orders WHERE status = 'paid'"
        )->fetch();
    }

    public static function salesByProduct(): array
    {
        return Database::connection()->query(
            "SELECT p.name,
                    SUM(oi.quantity)                  AS units_sold,
                    SUM(oi.quantity * oi.unit_price)  AS revenue
             FROM order_items oi
             JOIN product_variants v ON v.id = oi.variant_id
             JOIN products p ON p.id = v.product_id
             JOIN orders o ON o.id = oi.order_id
             WHERE o.status = 'paid'
             GROUP BY p.id
             ORDER BY units_sold DESC"
        )->fetchAll();
    }
}
