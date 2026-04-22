// app.js
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    drawCanvasLogo();
    initGeolocation(); 
    loadCart(); 
    initCalendar();
    initSearch();
    
    // 1. Eventos de abrir e fechar o Modal
    document.getElementById('cartBtn').addEventListener('click', openCartModal);
    document.getElementById('closeCartBtn').addEventListener('click', closeCartModal);

    // 2. Botão "Finalizar" verde do cabeçalho (abre o modal)
    const quickCheckoutBtn = document.getElementById('quickCheckoutBtn');
    if (quickCheckoutBtn) {
        quickCheckoutBtn.addEventListener('click', openCartModal); 
    }

    // 3. Botão "Finalizar Compra" laranja DENTRO do modal (redireciona para o checkout)
    const modalCheckoutBtn = document.querySelector('.cart-modal__checkout'); // ✅ Ponto da classe adicionado
    if (modalCheckoutBtn) {
        modalCheckoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }
});

/**
 * 1. Função para desenhar o logo da T-Shirt Store (um cabide)
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
 * 2. Função para implementar a API HTML5 de Geolocalização
 */
function initGeolocation() {
   const btnLocation = document.getElementById('btnLocation');
   const locationResult = document.getElementById('locationResult');

   if (!btnLocation || !locationResult) return;

   btnLocation.addEventListener('click', () => {
       if ("geolocation" in navigator) {
           locationResult.innerHTML = "<p>Buscando sua localização...</p>";
           
           navigator.geolocation.getCurrentPosition(
               (position) => {
                   const lat = position.coords.latitude;
                   const lon = position.coords.longitude;

                   const stores = [
                       { name: "Loja UCAM (Guadalupe)", lat: 37.9922, lon: -1.1842 },
                       { name: "Loja Centro (Gran Vía)", lat: 37.9838, lon: -1.1306 }
                   ];

                   locationResult.innerHTML = `
                       <p style="color: #27ae60; font-weight: bold;">✅ Localização encontrada!</p>
                       <p>Sua posição: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}</p>
                       <br>
                       <p>🏪 <strong>Ponto de retirada sugerido:</strong> ${stores[0].name}</p>
                   `;
               },
               (error) => {
                   let errorMessage = "";
                   switch(error.code) {
                       case error.PERMISSION_DENIED:
                           errorMessage = "Você negou o pedido de localização. Não poderemos sugerir a loja mais próxima.";
                           break;
                       case error.POSITION_UNAVAILABLE:
                           errorMessage = "Informação de localização indisponível no momento.";
                           break;
                       case error.TIMEOUT:
                           errorMessage = "O tempo da requisição expirou.";
                           break;
                       default:
                           errorMessage = "Ocorreu um erro desconhecido ao buscar sua localização.";
                           break;
                   }
                   locationResult.innerHTML = `<p style="color: #c0392b;">❌ ${errorMessage}</p>`;
               }
           );
       } else {
           locationResult.innerHTML = "<p>Geolocalização não é suportada pelo seu navegador.</p>";
       }
   });
}

/**
 * ---------------------------------------------------------
 * LÓGICA DO WEB STORAGE E MODAL DO CARRINHO
 * ---------------------------------------------------------
 */


function addToCart(name, price) {
    cart.push({ name: name, price: price });
    localStorage.setItem('tshirt_store_cart', JSON.stringify(cart));
    updateCartUI();
    alert(`A camiseta "${name}" foi adicionada ao carrinho!`);
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
        list.innerHTML = '<li>O carrinho está vazio.</li>';
    } else {
        cart.forEach((item) => {
            total += item.price;
            list.innerHTML += `
                <li>
                    <span>👕 ${item.name}</span>
                    <span>€ ${item.price.toFixed(2).replace('.', ',')}</span>
                </li>
            `;
        });
    }

    totalSpan.textContent = `€ ${total.toFixed(2).replace('.', ',')}`;
    
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
 * LÓGICA DO CALENDÁRIO DE PROMOÇÕES
 * ---------------------------------------------------------
 */

let currentDate = new Date(2026, 3, 1); 

const promoEvents = [
    { date: '2026-04-27', title: 'Flash Sale: 50% OFF em Básicas' },
    { date: '2026-04-28', title: 'Últimas horas da Flash Sale' },
    { date: '2026-05-01', title: 'Feriado: Frete Grátis em todo o site' },
    { date: '2026-05-03', title: 'Especial Dia das Mães: Kits Presente' },
    { date: '2026-05-04', title: 'Semana Geek: Novas Estampas' },
    { date: '2026-05-15', title: 'Promoção Quinzena: Leve 3, Pague 2' },
    { date: '2026-05-22', title: 'Drop Exclusivo: Coleção Minimalista' },
    { date: '2026-05-30', title: 'Pré-lançamento: Coleção de Verão' },
    { date: '2026-06-01', title: 'Especial Kids: Descontos na linha infantil' },
    { date: '2026-06-02', title: 'Nova Coleção: Cores Vibrantes' },
    { date: '2026-06-05', title: 'Sustentabilidade: Linha Algodão Orgânico' },
    { date: '2026-06-12', title: 'Especial Namorados: Desconto em Pares' },
    { date: '2026-06-20', title: 'Início do Verão: Festival de Regatas' },
    { date: '2026-06-24', title: 'Queima de Estoque Relâmpago' },
    { date: '2026-07-01', title: 'Início da Liquidação de Inverno (Até 70% OFF)' },
    { date: '2026-07-07', title: 'Semana do Cliente: Cupons Exclusivos' },
    { date: '2026-07-15', title: 'Lançamento: Nova Linha Premium' }
];

function initCalendar() {
    renderCalendar(currentDate);
}

function renderCalendar(date) {
    const calendarDiv = document.getElementById('promoCalendar');
    if (!calendarDiv) return;

    const year = date.getFullYear();
    const month = date.getMonth();
    
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayDate = new Date(year, month + 1, 0).getDate();

    let html = `
        <div class="calendar-container">
            <div class="calendar-header">
                <button onclick="changeMonth(-1)">&#9664; Anterior</button>
                <h3>${monthNames[month]} ${year}</h3>
                <button onclick="changeMonth(1)">Próximo &#9654;</button>
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