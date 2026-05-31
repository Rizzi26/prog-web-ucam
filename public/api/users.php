<?php

declare(strict_types=1);

require_once __DIR__ . '/../../src/bootstrap.php';

if (!is_admin()) {
    json_error('Forbidden.', 403);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_ok(['users' => User::all()]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed.', 405);
}

$input = read_input();

if (!csrf_verify($input['csrf_token'] ?? null)) {
    json_error('Invalid CSRF token.', 419);
}

$action = $input['action'] ?? '';
$id     = to_int($input['id'] ?? null);

if ($id === null) {
    json_error('User id is required.');
}

if ($id === current_user_id()) {
    json_error('You cannot modify your own account here.', 409);
}

switch ($action) {
    case 'set_role':
        $role = clean_string($input['role'] ?? '');
        if (!in_array($role, ['customer', 'admin'], true)) {
            json_error('Invalid role.');
        }
        User::updateRole($id, $role);
        json_ok();
        break;

    case 'delete':
        User::delete($id);
        json_ok();
        break;

    default:
        json_error('Unknown action.');
}
