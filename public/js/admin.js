const ADMIN_BASE = $('meta[name="base-path"]').attr('content') || '';
const ADMIN_CSRF = $('meta[name="csrf-token"]').attr('content') || '';

function adminPost(endpoint, payload) {
    return $.ajax({
        url: ADMIN_BASE + 'api/' + endpoint,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(Object.assign({ csrf_token: ADMIN_CSRF }, payload)),
    });
}

function notify(text, isError) {
    $('#adminMessage').text(text).css('color', isError ? '#c0392b' : '#27ae60');
}

function reloadSoon() {
    setTimeout(function () { window.location.reload(); }, 600);
}

$(function () {
    $('#productCreateForm').on('submit', function (e) {
        e.preventDefault();
        adminPost('products.php', {
            action: 'create',
            name: $(this).find('[name="name"]').val(),
            description: $(this).find('[name="description"]').val(),
            price: $(this).find('[name="price"]').val(),
            image: $(this).find('[name="image"]').val(),
        }).done(function (res) {
            if (res.ok) { notify('Product created.'); reloadSoon(); }
            else { notify(res.error, true); }
        }).fail(function (xhr) { notify(errorOf(xhr), true); });
    });

    $('.product-delete-btn').on('click', function () {
        if (!confirm('Delete this product?')) { return; }
        const id = $(this).closest('tr').data('product-id');
        adminPost('products.php', { action: 'delete', id: id })
            .done(function (res) { res.ok ? (notify('Product deleted.'), reloadSoon()) : notify(res.error, true); })
            .fail(function (xhr) { notify(errorOf(xhr), true); });
    });

    $('.variant-add-form').on('submit', function (e) {
        e.preventDefault();
        adminPost('products.php', {
            action: 'add_variant',
            product_id: $(this).data('product-id'),
            size: $(this).find('[name="size"]').val(),
            color: $(this).find('[name="color"]').val(),
            stock_qty: $(this).find('[name="stock_qty"]').val(),
        }).done(function (res) {
            if (res.ok) { notify('Variant added.'); reloadSoon(); }
            else { notify(res.error, true); }
        }).fail(function (xhr) { notify(errorOf(xhr), true); });
    });

    $('.variant-save-btn').on('click', function () {
        const row = $(this).closest('.variant-row');
        adminPost('products.php', {
            action: 'update_stock',
            variant_id: row.data('variant-id'),
            stock_qty: row.find('.variant-stock').val(),
        }).done(function (res) { notify(res.ok ? 'Stock updated.' : res.error, !res.ok); })
          .fail(function (xhr) { notify(errorOf(xhr), true); });
    });

    $('.variant-delete-btn').on('click', function () {
        const row = $(this).closest('.variant-row');
        adminPost('products.php', { action: 'delete_variant', variant_id: row.data('variant-id') })
            .done(function (res) { res.ok ? row.remove() : notify(res.error, true); })
            .fail(function (xhr) { notify(errorOf(xhr), true); });
    });

    $('.user-role-select').on('change', function () {
        const id = $(this).closest('tr').data('user-id');
        adminPost('users.php', { action: 'set_role', id: id, role: $(this).val() })
            .done(function (res) { notify(res.ok ? 'Role updated.' : res.error, !res.ok); })
            .fail(function (xhr) { notify(errorOf(xhr), true); });
    });

    $('.user-delete-btn').on('click', function () {
        if (!confirm('Delete this user?')) { return; }
        const id = $(this).closest('tr').data('user-id');
        adminPost('users.php', { action: 'delete', id: id })
            .done(function (res) { res.ok ? (notify('User deleted.'), reloadSoon()) : notify(res.error, true); })
            .fail(function (xhr) { notify(errorOf(xhr), true); });
    });
});

function errorOf(xhr) {
    return (xhr.responseJSON && xhr.responseJSON.error) || 'Request failed.';
}
