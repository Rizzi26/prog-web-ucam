const BASE_PATH = $('meta[name="base-path"]').attr('content') || '';
const CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content') || '';

function apiUrl(path) {
    return BASE_PATH + 'api/' + path;
}

function escapeHtml(value) {
    return $('<div>').text(value == null ? '' : value).html();
}

$(function () {
    drawCanvasLogo();
    initGeolocation();
    initCalendar();
    initSearch();
    refreshCart();

    $('#cartBtn').on('click', openCartModal);
    $('#closeCartBtn').on('click', closeCartModal);

    $(document).on('click', '.add-to-cart-btn', function () {
        const card = $(this).closest('.product-card');
        const variantId = card.find('.variant-select').val();
        if (!variantId) {
            return;
        }
        $.ajax({
            url: apiUrl('cart.php'),
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ action: 'add', variant_id: variantId, quantity: 1, csrf_token: CSRF_TOKEN }),
        }).done(function (res) {
            if (res.ok) {
                renderCart(res);
                openCartModal();
            }
        });
    });

    $(document).on('click', '.cart-remove-btn', function () {
        const variantId = $(this).data('variant-id');
        $.ajax({
            url: apiUrl('cart.php'),
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ action: 'remove', variant_id: variantId, csrf_token: CSRF_TOKEN }),
        }).done(function (res) {
            if (res.ok) {
                renderCart(res);
            }
        });
    });

    $('#goCheckoutBtn').on('click', function () {
        window.location.href = BASE_PATH + 'checkout.php';
    });
});

function refreshCart() {
    $.getJSON(apiUrl('cart.php')).done(function (res) {
        if (res.ok) {
            renderCart(res);
        }
    });
}

function renderCart(res) {
    $('#cartCount').text(res.count);

    const list = $('#cartItemsList');
    const totalSpan = $('#cartTotal');
    if (!list.length) {
        return;
    }

    list.empty();
    if (!res.items || res.items.length === 0) {
        list.append('<li>The cart is empty.</li>');
    } else {
        res.items.forEach(function (item) {
            list.append(
                '<li><span>👕 ' + escapeHtml(item.name) + ' (' + escapeHtml(item.size) + '/' + escapeHtml(item.color) + ') ×' + parseInt(item.quantity, 10) + '</span>' +
                '<span>€ ' + Number(item.subtotal).toFixed(2) +
                ' <button class="cart-remove-btn" data-variant-id="' + parseInt(item.variant_id, 10) + '" style="border:none;background:none;cursor:pointer;color:#c0392b;">✕</button></span></li>'
            );
        });
    }
    totalSpan.text('€ ' + (res.total || 0).toFixed(2));
}

function openCartModal() {
    $('#cartModal').css('display', 'flex');
}

function closeCartModal() {
    $('#cartModal').css('display', 'none');
}

$(window).on('click', function (event) {
    if (event.target === document.getElementById('cartModal')) {
        closeCartModal();
    }
});

function initSearch() {
    const input = $('#searchInput');
    if (!input.length) {
        return;
    }
    const filter = function () {
        const term = input.val().toLowerCase();
        $('.product-card').each(function () {
            const name = ($(this).data('name') || '').toString().toLowerCase();
            $(this).toggle(name.indexOf(term) !== -1);
        });
    };
    input.on('input', filter);
    $('.search__button').on('click', filter);
}

function drawCanvasLogo() {
    const canvas = document.getElementById('logoCanvas');
    if (!canvas) {
        return;
    }
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2c3e50';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.arc(40, 25, 10, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(40, 35);
    ctx.lineTo(40, 45);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(40, 45);
    ctx.lineTo(15, 60);
    ctx.lineTo(65, 60);
    ctx.closePath();
    ctx.stroke();
}

function initGeolocation() {
    const btnLocation = document.getElementById('btnLocation');
    const locationResult = document.getElementById('locationResult');
    if (!btnLocation || !locationResult) {
        return;
    }

    btnLocation.addEventListener('click', function () {
        if (!('geolocation' in navigator)) {
            locationResult.innerHTML = '<p>Geolocation is not supported by your browser.</p>';
            return;
        }
        locationResult.innerHTML = '<p>Fetching your location...</p>';
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const stores = [
                    { name: 'UCAM Store (Guadalupe)', lat: 37.9922, lon: -1.1842 },
                    { name: 'Downtown Store (Gran Vía)', lat: 37.9838, lon: -1.1306 },
                ];
                locationResult.innerHTML =
                    '<p style="color:#27ae60; font-weight:bold;">✅ Location found!</p>' +
                    '<p>Your position: Lat ' + lat.toFixed(4) + ', Lon ' + lon.toFixed(4) + '</p><br>' +
                    '<p>🏪 <strong>Suggested pickup point:</strong> ' + stores[0].name + '</p>';
            },
            function (error) {
                let message;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'You denied the request for Geolocation. We will not be able to suggest the nearest store.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information is currently unavailable.';
                        break;
                    case error.TIMEOUT:
                        message = 'The request to get your location timed out.';
                        break;
                    default:
                        message = 'An unknown error occurred while fetching your location.';
                }
                locationResult.innerHTML = '<p style="color:#c0392b;">❌ ' + message + '</p>';
            }
        );
    });
}

let currentDate = new Date(2026, 3, 1);

const promoEvents = [
    { date: '2026-04-27', title: 'Flash Sale: 50% OFF on Basics' },
    { date: '2026-05-01', title: 'Holiday: Free Shipping sitewide' },
    { date: '2026-05-15', title: 'Fortnight Promo: Buy 3, Pay for 2' },
    { date: '2026-06-05', title: 'Sustainability: Organic Cotton Line' },
    { date: '2026-07-01', title: 'Start of Winter Sale (Up to 70% OFF)' },
];

function initCalendar() {
    if (document.getElementById('promoCalendar')) {
        renderCalendar(currentDate);
    }
}

function renderCalendar(date) {
    const calendarDiv = document.getElementById('promoCalendar');
    if (!calendarDiv) {
        return;
    }
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayDate = new Date(year, month + 1, 0).getDate();

    let html =
        '<div class="calendar-container"><div class="calendar-header">' +
        '<button onclick="changeMonth(-1)">&#9664; Previous</button>' +
        '<h3>' + monthNames[month] + ' ' + year + '</h3>' +
        '<button onclick="changeMonth(1)">Next &#9654;</button>' +
        '</div><div class="calendar-grid">';

    dayNames.forEach(function (day) {
        html += '<div class="calendar-day-name">' + day + '</div>';
    });
    for (let i = 0; i < firstDayIndex; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    for (let day = 1; day <= lastDayDate; day++) {
        const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        const eventToday = promoEvents.find(function (ev) { return ev.date === dateStr; });
        if (eventToday) {
            html += '<div class="calendar-day has-event" title="' + eventToday.title + '"><span>' + day + '</span><div class="event-badge">' + eventToday.title + '</div></div>';
        } else {
            html += '<div class="calendar-day"><span>' + day + '</span></div>';
        }
    }
    html += '</div></div>';
    calendarDiv.innerHTML = html;
}

window.changeMonth = function (direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar(currentDate);
};
