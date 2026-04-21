// app.js

// Aguarda o carregamento completo do HTML antes de executar os scripts
document.addEventListener("DOMContentLoaded", () => {
    drawCanvasLogo();
    initGeolocation(); // Iniciamos a API de Geolocalização aqui
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

    // Gancho
    ctx.beginPath();
    ctx.arc(40, 25, 10, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();

    // Pescoço
    ctx.beginPath();
    ctx.moveTo(40, 35);
    ctx.lineTo(40, 45);
    ctx.stroke();

    // Base
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

    // Verifica se os elementos existem na página
    if (!btnLocation || !locationResult) return;

    btnLocation.addEventListener('click', () => {
        // Verifica se o navegador suporta a API
        if ("geolocation" in navigator) {
            locationResult.innerHTML = "<p>Buscando sua localização...</p>";
            
            // Pede a posição atual do usuário
            navigator.geolocation.getCurrentPosition(
                // Callback de Sucesso
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Simulando lojas físicas para o projeto
                    // Usando coordenadas reais como brincadeira para o escopo do projeto
                    const stores = [
                        { name: "Loja UCAM (Guadalupe)", lat: 37.9922, lon: -1.1842 },
                        { name: "Loja Centro (Gran Vía)", lat: 37.9838, lon: -1.1306 }
                    ];

                    // Na Fase 2 (PHP) vocês poderiam calcular a distância exata. 
                    // Por enquanto, mostramos a posição do usuário e sugerimos a primeira loja.
                    locationResult.innerHTML = `
                        <p style="color: #27ae60; font-weight: bold;">✅ Localização encontrada!</p>
                        <p>Sua posição: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}</p>
                        <br>
                        <p>🏪 <strong>Ponto de retirada sugerido:</strong> ${stores[0].name}</p>
                    `;
                },
                // Callback de Erro
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
            // Caso o navegador seja muito antigo
            locationResult.innerHTML = "<p>Geolocalização não é suportada pelo seu navegador.</p>";
        }
    });
}