// Example JS for dynamic price updates.
// In production, replace with AJAX/WebSocket calls to your backend API.

const tickers = ["AAPL", "GOOGL"];
function mockFetchPrice(symbol) {
    // Simulate fetching a live price in Euros
    if (symbol === "AAPL") {
        return (Math.random() * (200 - 120) + 120).toFixed(2);
    } else if (symbol === "GOOGL") {
        return (Math.random() * (2800 - 2400) + 2400).toFixed(2);
    }
    return (Math.random() * (300 - 100) + 100).toFixed(2);
}

function updatePrices() {
    tickers.forEach(symbol => {
        const price = mockFetchPrice(symbol);
        const priceElement = document.getElementById(`price-${symbol}`);
        if (priceElement) {
            const formattedPrice = parseFloat(price) >= 1000 ? 
                `€${parseFloat(price).toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 
                `€${price}`;
            priceElement.innerText = formattedPrice;
        }
        
        // Update trading analysis current prices
        const currentPriceElement = document.querySelector(`.current-price[data-ticker="${symbol}"]`);
        if (currentPriceElement) {
            const formattedPrice = parseFloat(price) >= 1000 ? 
                `€${parseFloat(price).toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 
                `€${price}`;
            currentPriceElement.innerText = formattedPrice;
        }
    });
    
    // Update trading analysis after price changes
    updateTradingAnalysis();
}

// Calculator Functions
function setupCalculators() {
    // Investment Calculator
    const investmentAmount = document.getElementById('investment-amount');
    const sharePrice = document.getElementById('share-price');
    const sharesResult = document.getElementById('shares-result');
    
    function updateInvestmentCalc() {
        const amount = parseFloat(investmentAmount.value) || 0;
        const price = parseFloat(sharePrice.value) || 1;
        const shares = Math.floor(amount / price);
        sharesResult.textContent = shares;
    }
    
    if (investmentAmount && sharePrice) {
        investmentAmount.addEventListener('input', updateInvestmentCalc);
        sharePrice.addEventListener('input', updateInvestmentCalc);
    }
    
    // Profit/Loss Calculator
    const sharesOwned = document.getElementById('shares-owned');
    const purchasePrice = document.getElementById('purchase-price');
    const currentPrice = document.getElementById('current-price');
    const profitLossResult = document.getElementById('profit-loss-result');
    const roiResult = document.getElementById('roi-result');
    
    function updateProfitLossCalc() {
        const shares = parseFloat(sharesOwned.value) || 0;
        const buyPrice = parseFloat(purchasePrice.value) || 0;
        const sellPrice = parseFloat(currentPrice.value) || 0;
        
        const totalCost = shares * buyPrice;
        const totalValue = shares * sellPrice;
        const profitLoss = totalValue - totalCost;
        const roi = totalCost > 0 ? ((profitLoss / totalCost) * 100) : 0;
        
        if (profitLossResult) {
            profitLossResult.textContent = `€${profitLoss.toFixed(2)}`;
            profitLossResult.className = `calc-value ${profitLoss >= 0 ? 'positive' : 'negative'}`;
        }
        
        if (roiResult) {
            roiResult.textContent = `${roi.toFixed(2)}%`;
            roiResult.className = `calc-value ${roi >= 0 ? 'positive' : 'negative'}`;
        }
    }
    
    if (sharesOwned && purchasePrice && currentPrice) {
        sharesOwned.addEventListener('input', updateProfitLossCalc);
        purchasePrice.addEventListener('input', updateProfitLossCalc);
        currentPrice.addEventListener('input', updateProfitLossCalc);
    }
}

// Trading Analysis Functions
function updateTradingAnalysis() {
    const rows = document.querySelectorAll('#trading-table-body tr');
    let totalPortfolioValue = 0;
    let totalCost = 0;
    
    rows.forEach(row => {
        const ticker = row.cells[0].textContent;
        const sharesInput = row.querySelector('.shares-input input');
        const purchaseInput = row.querySelector('.purchase-input input');
        const currentPriceCell = row.querySelector('.current-price');
        const totalValueCell = row.querySelector('.total-value');
        const profitLossCell = row.querySelector('.profit-loss');
        const changePercentCell = row.querySelector('.change-percent');
        
        const shares = parseFloat(sharesInput.value) || 0;
        const purchasePrice = parseFloat(purchaseInput.value) || 0;
        const currentPriceText = currentPriceCell.textContent.replace('€', '').replace(',', '');
        const currentPrice = parseFloat(currentPriceText) || 0;
        
        const totalValue = shares * currentPrice;
        const cost = shares * purchasePrice;
        const profitLoss = totalValue - cost;
        const changePercent = cost > 0 ? ((profitLoss / cost) * 100) : 0;
        
        totalValueCell.textContent = `€${totalValue.toFixed(2)}`;
        profitLossCell.textContent = `€${profitLoss.toFixed(2)}`;
        profitLossCell.className = `profit-loss ${profitLoss >= 0 ? 'positive' : 'negative'}`;
        changePercentCell.textContent = `${changePercent.toFixed(2)}%`;
        changePercentCell.className = `change-percent ${changePercent >= 0 ? 'positive' : 'negative'}`;
        
        totalPortfolioValue += totalValue;
        totalCost += cost;
    });
    
    const totalProfitLoss = totalPortfolioValue - totalCost;
    const portfolioROI = totalCost > 0 ? ((totalProfitLoss / totalCost) * 100) : 0;
    
    // Update portfolio summary
    const totalPortfolioElement = document.getElementById('total-portfolio-value');
    const totalProfitLossElement = document.getElementById('total-profit-loss');
    const portfolioROIElement = document.getElementById('portfolio-roi');
    const mainPortfolioValue = document.getElementById('portfolio-value');
    const mainROI = document.getElementById('roi');
    
    if (totalPortfolioElement) {
        totalPortfolioElement.textContent = `€${totalPortfolioValue.toFixed(2)}`;
    }
    
    if (totalProfitLossElement) {
        totalProfitLossElement.textContent = `€${totalProfitLoss.toFixed(2)}`;
        totalProfitLossElement.className = `summary-value profit-loss ${totalProfitLoss >= 0 ? 'positive' : 'negative'}`;
    }
    
    if (portfolioROIElement) {
        portfolioROIElement.textContent = `${portfolioROI.toFixed(2)}%`;
    }
    
    // Update main KPI section
    if (mainPortfolioValue) {
        mainPortfolioValue.textContent = `€${totalPortfolioValue.toFixed(0)}`;
    }
    
    if (mainROI) {
        mainROI.textContent = `${portfolioROI.toFixed(1)}%`;
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupCalculators();
    updateTradingAnalysis();
    
    // Poll every 10 seconds (demo)
    setInterval(updatePrices, 10000);
});
