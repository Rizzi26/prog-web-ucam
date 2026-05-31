<?php

declare(strict_types=1);

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function clean_string(mixed $value): string
{
    return trim((string) $value);
}

function valid_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function to_decimal(mixed $value): ?float
{
    if (!is_numeric($value)) {
        return null;
    }
    return round((float) $value, 2);
}

function to_int(mixed $value): ?int
{
    if (!is_numeric($value)) {
        return null;
    }
    return (int) $value;
}
