const AUTH_BASE = $('meta[name="base-path"]').attr('content') || '';
const AUTH_CSRF = $('meta[name="csrf-token"]').attr('content') || '';

function submitAuth(action, payload) {
    return $.ajax({
        url: AUTH_BASE + 'api/auth.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(Object.assign({ action: action, csrf_token: AUTH_CSRF }, payload)),
    });
}

$(function () {
    const message = $('#authMessage');

    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        submitAuth('login', {
            email: $(this).find('[name="email"]').val(),
            password: $(this).find('[name="password"]').val(),
        }).done(function () {
            window.location.href = AUTH_BASE + 'index.php';
        }).fail(function (xhr) {
            message.text((xhr.responseJSON && xhr.responseJSON.error) || 'Login failed.');
        });
    });

    $('#registerForm').on('submit', function (e) {
        e.preventDefault();
        submitAuth('register', {
            name: $(this).find('[name="name"]').val(),
            email: $(this).find('[name="email"]').val(),
            password: $(this).find('[name="password"]').val(),
        }).done(function () {
            window.location.href = AUTH_BASE + 'index.php';
        }).fail(function (xhr) {
            message.text((xhr.responseJSON && xhr.responseJSON.error) || 'Registration failed.');
        });
    });
});
