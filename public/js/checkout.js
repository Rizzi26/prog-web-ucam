const CHECKOUT_BASE = $('meta[name="base-path"]').attr('content') || '';
const CHECKOUT_CSRF = $('meta[name="csrf-token"]').attr('content') || '';

function checkoutApi(path) {
    return CHECKOUT_BASE + 'api/' + path;
}

function escapeHtml(value) {
    return $('<div>').text(value == null ? '' : value).html();
}

$(function () {
    loadCheckoutSummary();
    initCheckoutGeolocation();
    handleFormSubmission();
});

function loadCheckoutSummary() {
    const container = $('#checkoutSummary');
    $.getJSON(checkoutApi('cart.php')).done(function (res) {
        if (!res.ok || !res.items || res.items.length === 0) {
            container.html('<p>Your cart is empty. <a href="' + CHECKOUT_BASE + 'index.php">Back to shopping</a>.</p>');
            $('#checkoutForm').hide();
            return;
        }
        let html = '<ul style="list-style:none; padding:0;">';
        res.items.forEach(function (item) {
            html +=
                '<li style="display:flex; justify-content:space-between; border-bottom:1px solid #ddd; padding:0.5rem 0;">' +
                '<span>👕 ' + escapeHtml(item.name) + ' (' + escapeHtml(item.size) + '/' + escapeHtml(item.color) + ') ×' + parseInt(item.quantity, 10) + '</span>' +
                '<span>€ ' + Number(item.subtotal).toFixed(2) + '</span></li>';
        });
        html += '</ul><div style="text-align:right; margin-top:1rem; font-size:1.2rem;"><strong>Total to pay: € ' + res.total.toFixed(2) + '</strong></div>';
        container.html(html);
    });
}

function initCheckoutGeolocation() {
    const addressResult = document.getElementById('addressResult');
    const manualAddress = document.getElementById('manualAddress');

    $('#btnGetAddress').on('click', function () {
        if (!('geolocation' in navigator)) {
            addressResult.textContent = 'Your browser does not support geolocation.';
            return;
        }
        addressResult.style.color = '#2c3e50';
        addressResult.textContent = 'Searching satellites and resolving address...';

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                $.getJSON('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon)
                    .done(function (data) {
                        const a = data.address || {};
                        const street = a.road || a.pedestrian || 'Unidentified address';
                        const number = a.house_number || 'N/A';
                        const district = a.suburb || a.neighbourhood || '';
                        const city = a.city || a.town || a.village || '';
                        manualAddress.value = (street + ', ' + number + ' - ' + district + ', ' + city).replace(/ - ,/g, ',');
                        addressResult.style.color = '#27ae60';
                        addressResult.textContent = '✅ Location obtained successfully!';
                    })
                    .fail(function () {
                        manualAddress.value = 'Lat: ' + lat.toFixed(4) + ', Lon: ' + lon.toFixed(4);
                        addressResult.textContent = '✅ Coordinates obtained, but failed to resolve the street name.';
                    });
            },
            function () {
                addressResult.style.color = '#c0392b';
                addressResult.textContent = '❌ Could not get your location. Please check your browser permissions.';
            }
        );
    });
}

function handleFormSubmission() {
    $('#checkoutForm').on('submit', function (e) {
        e.preventDefault();
        const message = $('#checkoutMessage');
        const address = $('#manualAddress').val();
        const payment = $('input[name="payment"]:checked').val();

        if (!payment) {
            message.text('Please select a payment method.');
            return;
        }

        $.ajax({
            url: checkoutApi('orders.php'),
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ address: address, payment_method: payment, csrf_token: CHECKOUT_CSRF }),
        }).done(function (res) {
            if (res.ok) {
                alert('Order confirmed!\nInvoice: ' + res.invoice_number + '\nTotal: € ' + res.total.toFixed(2) + '\nDelivery to: ' + address);
                window.location.href = CHECKOUT_BASE + 'account.php';
            } else {
                message.text(res.error || 'Could not place the order.');
            }
        }).fail(function (xhr) {
            message.text((xhr.responseJSON && xhr.responseJSON.error) || 'Could not place the order.');
        });
    });
}
