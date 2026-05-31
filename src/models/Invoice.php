<?php

declare(strict_types=1);

final class Invoice
{
    public static function issue(int $orderId, float $total): array
    {
        $number = self::generateNumber($orderId);
        $stmt = Database::connection()->prepare(
            'INSERT INTO invoices (order_id, number, total) VALUES (?, ?, ?)'
        );
        $stmt->execute([$orderId, $number, $total]);

        return ['number' => $number, 'total' => $total];
    }

    public static function findByOrder(int $orderId): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM invoices WHERE order_id = ? LIMIT 1'
        );
        $stmt->execute([$orderId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function all(): array
    {
        return Database::connection()->query(
            'SELECT i.*, u.name AS customer_name
             FROM invoices i
             JOIN orders o ON o.id = i.order_id
             JOIN users u ON u.id = o.user_id
             ORDER BY i.issued_at DESC'
        )->fetchAll();
    }

    private static function generateNumber(int $orderId): string
    {
        return sprintf('INV-%s-%04d', date('Y'), $orderId);
    }
}
