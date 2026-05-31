<?php

declare(strict_types=1);

require_once __DIR__ . '/../../src/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed.', 405);
}

$input = read_input();

if (!csrf_verify($input['csrf_token'] ?? null)) {
    json_error('Invalid CSRF token.', 419);
}

$action = $input['action'] ?? '';

switch ($action) {
    case 'register':
        $name     = clean_string($input['name'] ?? '');
        $email    = clean_string($input['email'] ?? '');
        $password = (string) ($input['password'] ?? '');

        if ($name === '' || $email === '' || $password === '') {
            json_error('All fields are required.');
        }
        if (!valid_email($email)) {
            json_error('Invalid email address.');
        }
        if (strlen($password) < 6) {
            json_error('Password must be at least 6 characters.');
        }
        if (User::findByEmail($email) !== null) {
            json_error('This email is already registered.', 409);
        }

        $id = User::create($name, $email, $password);
        login_user($id, $name, 'customer');
        json_ok(['user' => ['id' => $id, 'name' => $name, 'role' => 'customer']]);
        break;

    case 'login':
        $email    = clean_string($input['email'] ?? '');
        $password = (string) ($input['password'] ?? '');

        $user = User::attempt($email, $password);
        if ($user === null) {
            json_error('Invalid email or password.', 401);
        }

        login_user((int) $user['id'], $user['name'], $user['role']);
        json_ok(['user' => ['id' => (int) $user['id'], 'name' => $user['name'], 'role' => $user['role']]]);
        break;

    case 'logout':
        logout_user();
        json_ok();
        break;

    default:
        json_error('Unknown action.');
}
