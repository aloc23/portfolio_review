// Example JS for dynamic price updates.
// In production, replace with AJAX/WebSocket calls to your backend API.

const tickers = ["AAPL", "GOOGL"];
function mockFetchPrice(symbol) {
    // Simulate fetching a live price
    return (Math.random() * (3000 - 100) + 100).toFixed(2);
}

function updatePrices() {
    tickers.forEach(symbol => {
        const price = mockFetchPrice(symbol);
        document.getElementById(`price-${symbol}`).innerText = `$${price}`;
    });
}

// Poll every 10 seconds (demo)
setInterval(updatePrices, 10000);