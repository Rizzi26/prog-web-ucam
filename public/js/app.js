// app.js
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    drawCanvasLogo();
    initGeolocation(); 
    loadCart(); 
    initCalendar();
    initSearch();
    
    // 1. Events to open and close the Modal
    document.getElementById('cartBtn').addEventListener('click', openCartModal);
    document.getElementById('closeCartBtn').addEventListener('click', closeCartModal);

    // 2. Green "Checkout" button in the header (opens the modal)
    const quickCheckoutBtn = document.getElementById('quickCheckoutBtn');
    if (quickCheckoutBtn) {
        quickCheckoutBtn.addEventListener('click', openCartModal); 
    }

    // 3. Orange "Checkout" button INSIDE the modal (redirects to checkout)
    const modalCheckoutBtn = document.querySelector('.cart-modal__checkout'); // ✅ Added dot for class selector
    if (modalCheckoutBtn) {
        modalCheckoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }
});

/**
 * 1. Function to draw the T-Shirt Store logo (a hanger)
 */
function drawCanvasLogo() {
    const canvas = document.getElementById('logoCanvas');
    if (!canvas) return; 
    
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

/**
 * 2. Function to implement the HTML5 Geolocation API
 */
function initGeolocation() {
   const btnLocation = document.getElementById('btnLocation');
   const locationResult = document.getElementById('locationResult');

   if (!btnLocation || !locationResult) return;

   btnLocation.addEventListener('click', () => {
       if ("geolocation" in navigator) {
           locationResult.innerHTML = "<p>Fetching your location...</p>";
           
           navigator.geolocation.getCurrentPosition(
               (position) => {
                   const lat = position.coords.latitude;
                   const lon = position.coords.longitude;

                   const stores = [
                       { name: "UCAM Store (Guadalupe)", lat: 37.9922, lon: -1.1842 },
                       { name: "Downtown Store (Gran Vía)", lat: 37.9838, lon: -1.1306 }
                   ];

                   locationResult.innerHTML = `
                       <p style="color: #27ae60; font-weight: bold;">✅ Location found!</p>
                       <p>Your position: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}</p>
                       <br>
                       <p>🏪 <strong>Suggested pickup point:</strong> ${stores[0].name}</p>
                   `;
               },
               (error) => {
                   let errorMessage = "";
                   switch(error.code) {
                       case error.PERMISSION_DENIED:
                           errorMessage = "You denied the request for Geolocation. We will not be able to suggest the nearest store.";
                           break;
                       case error.POSITION_UNAVAILABLE:
                           errorMessage = "Location information is currently unavailable.";
                           break;
                       case error.TIMEOUT:
                           errorMessage = "The request to get your location timed out.";
                           break;
                       default:
                           errorMessage = "An unknown error occurred while fetching your location.";
                           break;
                   }
                   locationResult.innerHTML = `<p style="color: #c0392b;">❌ ${errorMessage}</p>`;
               }
           );
       } else {
           locationResult.innerHTML = "<p>Geolocation is not supported by your browser.</p>";
       }
   });
}

/**
 * ---------------------------------------------------------
 * WEB STORAGE AND CART MODAL LOGIC
 * ---------------------------------------------------------
 */

function addToCart(name, price) {
    cart.push({ name: name, price: price });
    localStorage.setItem('tshirt_store_cart', JSON.stringify(cart));
    updateCartUI();
    alert(`The t-shirt "${name}" was added to the cart!`);
}

function loadCart() {
    const savedCart = localStorage.getItem('tshirt_store_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartUI();
}

function updateCartUI() {
    const cartCountElement = document.getElementById('cartCount');
    const quickCheckoutBtn = document.getElementById('quickCheckoutBtn');

    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }

    if (quickCheckoutBtn) {
        if (cart.length > 0) {
            quickCheckoutBtn.style.display = 'inline-block'; 
        } else {
            quickCheckoutBtn.style.display = 'none'; 
        }
    }
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    const list = document.getElementById('cartItemsList');
    const totalSpan = document.getElementById('cartTotal');
    
    list.innerHTML = ''; 
    let total = 0;

    if (cart.length === 0) {
        list.innerHTML = '<li>The cart is empty.</li>';
    } else {
        cart.forEach((item) => {
            total += item.price;
            list.innerHTML += `
                <li>
                    <span>👕 ${item.name}</span>
                    <span>€ ${item.price.toFixed(2)}</span>
                </li>
            `;
        });
    }

    totalSpan.textContent = `€ ${total.toFixed(2)}`;
    
    modal.style.display = 'flex';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

window.addEventListener('click', (event) => {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCartModal();
    }
});

/**
 * ---------------------------------------------------------
 * PROMOTIONS CALENDAR LOGIC
 * ---------------------------------------------------------
 */

let currentDate = new Date(2026, 3, 1); 

const promoEvents = [
    { date: '2026-04-27', title: 'Flash Sale: 50% OFF on Basics' },
    { date: '2026-04-28', title: 'Last hours of the Flash Sale' },
    { date: '2026-05-01', title: 'Holiday: Free Shipping sitewide' },
    { date: '2026-05-03', title: 'Mother\'s Day Special: Gift Kits' },
    { date: '2026-05-04', title: 'Geek Week: New Prints' },
    { date: '2026-05-15', title: 'Fortnight Promo: Buy 3, Pay for 2' },
    { date: '2026-05-22', title: 'Exclusive Drop: Minimalist Collection' },
    { date: '2026-05-30', title: 'Pre-launch: Summer Collection' },
    { date: '2026-06-01', title: 'Kids Special: Discounts on children\'s line' },
    { date: '2026-06-02', title: 'New Collection: Vibrant Colors' },
    { date: '2026-06-05', title: 'Sustainability: Organic Cotton Line' },
    { date: '2026-06-12', title: 'Valentine\'s Special: Discount on Pairs' },
    { date: '2026-06-20', title: 'Start of Summer: Tank Top Festival' },
    { date: '2026-06-24', title: 'Flash Clearance Sale' },
    { date: '2026-07-01', title: 'Start of Winter Sale (Up to 70% OFF)' },
    { date: '2026-07-07', title: 'Customer Week: Exclusive Coupons' },
    { date: '2026-07-15', title: 'Launch: New Premium Line' }
];

function initCalendar() {
    renderCalendar(currentDate);
}

function renderCalendar(date) {
    const calendarDiv = document.getElementById('promoCalendar');
    if (!calendarDiv) return;

    const year = date.getFullYear();
    const month = date.getMonth();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayDate = new Date(year, month + 1, 0).getDate();

    let html = `
        <div class="calendar-container">
            <div class="calendar-header">
                <button onclick="changeMonth(-1)">&#9664; Previous</button>
                <h3>${monthNames[month]} ${year}</h3>
                <button onclick="changeMonth(1)">Next &#9654;</button>
            </div>
            <div class="calendar-grid">
    `;

    dayNames.forEach(day => {
        html += `<div class="calendar-day-name">${day}</div>`;
    });

    for (let i = 0; i < firstDayIndex; i++) {
        html += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= lastDayDate; day++) {
        const currentLoopDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const eventToday = promoEvents.find(e => e.date === currentLoopDateStr);
        
        if (eventToday) {
            html += `
                <div class="calendar-day has-event" title="${eventToday.title}">
                    <span>${day}</span>
                    <div class="event-badge">${eventToday.title}</div>
                </div>`;
        } else {
            html += `
                <div class="calendar-day">
                    <span>${day}</span>
                </div>`;
        }
    }

    html += `
            </div>
        </div>
    `;

    calendarDiv.innerHTML = html;
}

window.changeMonth = function(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar(currentDate);
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search__button');
    const productCards = document.querySelectorAll('.product-card');

    if (!searchInput) return;

    const filterProducts = () => {
        const searchTerm = searchInput.value.toLowerCase();

        productCards.forEach(card => {
            const title = card.querySelector('.product-card__title').textContent.toLowerCase();
            
            if (title.includes(searchTerm)) {
                card.style.display = 'block'; 
            } else {
                card.style.display = 'none'; 
            }
        });
    };

    searchInput.addEventListener('input', filterProducts);

    if (searchButton) {
        searchButton.addEventListener('click', filterProducts);
    }
}