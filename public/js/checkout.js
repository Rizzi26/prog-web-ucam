// js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
    loadCheckoutSummary();
    initCheckoutGeolocation();
    handleFormSubmission();
});

function loadCheckoutSummary() {
    const summaryContainer = document.getElementById('checkoutSummary');
    const savedCart = localStorage.getItem('tshirt_store_cart');
    
    if (!savedCart || savedCart === '[]') {
        summaryContainer.innerHTML = '<p>Seu carrinho está vazio. <a href="index.html">Voltar às compras</a>.</p>';
        document.getElementById('checkoutForm').style.display = 'none';
        return;
    }

    const cart = JSON.parse(savedCart);
    let total = 0;
    let html = '<ul style="list-style: none; padding: 0;">';

    cart.forEach(item => {
        total += item.price;
        html += `
            <li style="display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding: 0.5rem 0;">
                <span>👕 ${item.name}</span>
                <span>€ ${item.price.toFixed(2).replace('.', ',')}</span>
            </li>
        `;
    });

    html += `</ul>
        <div style="text-align: right; margin-top: 1rem; font-size: 1.2rem;">
            <strong>Total a pagar: € ${total.toFixed(2).replace('.', ',')}</strong>
        </div>`;

    summaryContainer.innerHTML = html;
}


function initCheckoutGeolocation() {
    const btnGetAddress = document.getElementById('btnGetAddress');
    const addressResult = document.getElementById('addressResult');
    const manualAddressInput = document.getElementById('manualAddress');

    btnGetAddress.addEventListener('click', () => {
        if ("geolocation" in navigator) {
            addressResult.style.color = "#2c3e50";
            addressResult.textContent = "Buscando satélites e traduzindo endereço...";
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                        const data = await response.json();

                        const rua = data.address.road || data.address.pedestrian || "Endereço não identificado";
                        const numero = data.address.house_number || "S/N";
                        const bairro = data.address.suburb || data.address.neighbourhood || "";
                        const cidade = data.address.city || data.address.town || data.address.village || "";
                        
                        const enderecoReal = `${rua}, ${numero} - ${bairro}, ${cidade}`.replace(/ - ,/g, ',');
                        
                        addressResult.style.color = "#27ae60";
                        addressResult.innerHTML = `✅ Localização obtida com sucesso!`;
                        manualAddressInput.value = enderecoReal; 
                        
                    } catch (error) {
                        console.error("Erro na API de mapas:", error);
                        addressResult.innerHTML = `✅ Coordenadas obtidas, mas falha ao traduzir o nome da rua.`;
                        manualAddressInput.value = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
                    }
                },
                (error) => {
                    addressResult.style.color = "#c0392b";
                    addressResult.textContent = "❌ Não foi possível obter sua localização. Verifique as permissões do navegador.";
                }
            );
        } else {
            addressResult.textContent = "Seu navegador não suporta geolocalização.";
        }
    });
}

function handleFormSubmission() {
    const form = document.getElementById('checkoutForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const address = document.getElementById('manualAddress').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        
        alert(`Processando pagamento via ${paymentMethod.toUpperCase()}...\n\nPedido confirmado com sucesso para entrega em:\n${address}`);
        
        localStorage.removeItem('tshirt_store_cart');
        
        window.location.href = 'index.html';
    });
}