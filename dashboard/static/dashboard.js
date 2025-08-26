// Portfolio Dashboard with custom chart implementations
// Comprehensive investment portfolio review and bank performance analysis

// Global chart instances
let assetAllocationChart = null;
let performanceChart = null;
let bankFinancialsChart = null;

// Mock data for demonstration - ready for backend integration
const portfolioData = {
    allocation: {
        stocks: 65,
        bonds: 25,
        cash: 7,
        commodities: 3
    },
    performance: {
        portfolio: [100, 102, 105, 103, 108, 112, 115, 118, 120, 117, 122, 125],
        benchmark: [100, 101, 103, 102, 106, 109, 111, 114, 116, 114, 118, 121],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
};

const bankData = {
    kpis: {
        assets: 1250000000, // €1.25B
        deposits: 980000000, // €980M
        loans: 850000000,   // €850M
        equity: 125000000,  // €125M
        roa: 1.2,          // 1.2%
        roe: 12.5,         // 12.5%
        tier1Ratio: 14.8   // 14.8%
    },
    financials: {
        quarters: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
        netIncome: [12500000, 13200000, 14100000, 15800000], // in euros
        totalAssets: [1200000000, 1220000000, 1240000000, 1250000000],
        deposits: [950000000, 965000000, 975000000, 980000000]
    }
};

// Initialize all charts when DOM is loaded
function initializeCharts() {
    initAssetAllocationChart();
    initPerformanceChart();
    initBankFinancialsChart();
    updateBankKPIs();
}

// Simple Asset Allocation Pie Chart
function initAssetAllocationChart() {
    const canvas = document.getElementById('assetAllocationChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = portfolioData.allocation;
    
    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    
    const total = data.stocks + data.bonds + data.cash + data.commodities;
    const colors = ['#18bc9c', '#2c3e50', '#3498db', '#f39c12'];
    const labels = ['Stocks', 'Bonds', 'Cash', 'Commodities'];
    const values = [data.stocks, data.bonds, data.cash, data.commodities];
    
    let currentAngle = -Math.PI / 2; // Start at top
    
    // Draw pie slices
    values.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = colors[index];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add labels
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
        
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${labels[index]}: ${value}%`, labelX, labelY);
        
        currentAngle += sliceAngle;
    });
}

// Simple Performance Line Chart
function initPerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = portfolioData.performance;
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 300;
    
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    // Find min and max values
    const allValues = [...data.portfolio, ...data.benchmark];
    const minValue = Math.min(...allValues) - 5;
    const maxValue = Math.max(...allValues) + 5;
    
    // Draw grid and axes
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= data.months.length - 1; i++) {
        const x = padding + (i / (data.months.length - 1)) * chartWidth;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
    }
    
    // Draw portfolio line
    ctx.strokeStyle = '#18bc9c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    data.portfolio.forEach((value, index) => {
        const x = padding + (index / (data.portfolio.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw benchmark line
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    data.benchmark.forEach((value, index) => {
        const x = padding + (index / (data.benchmark.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Add labels
    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Month labels
    data.months.forEach((month, index) => {
        if (index % 2 === 0) { // Show every other month to avoid crowding
            const x = padding + (index / (data.months.length - 1)) * chartWidth;
            ctx.fillText(month, x, canvas.height - 10);
        }
    });
    
    // Legend
    ctx.fillStyle = '#18bc9c';
    ctx.fillRect(padding, 10, 15, 3);
    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Portfolio', padding + 20, 17);
    
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(padding + 100, 10, 15, 3);
    ctx.fillText('Benchmark', padding + 120, 17);
}

// Simple Bank Financials Bar Chart
function initBankFinancialsChart() {
    const canvas = document.getElementById('bankFinancialsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = bankData.financials;
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;
    
    const padding = 60;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    // Convert to millions for display
    const netIncomeData = data.netIncome.map(val => val / 1000000);
    const maxIncome = Math.max(...netIncomeData);
    
    const barWidth = chartWidth / (data.quarters.length * 2);
    
    // Draw bars
    netIncomeData.forEach((value, index) => {
        const x = padding + index * (chartWidth / data.quarters.length) + barWidth / 2;
        const barHeight = (value / maxIncome) * chartHeight * 0.8;
        const y = padding + chartHeight - barHeight;
        
        ctx.fillStyle = '#18bc9c';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Add value labels
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`€${value.toFixed(1)}M`, x + barWidth/2, y - 5);
    });
    
    // Add quarter labels
    data.quarters.forEach((quarter, index) => {
        const x = padding + index * (chartWidth / data.quarters.length) + barWidth;
        ctx.fillText(quarter, x, canvas.height - 20);
    });
    
    // Add title and axis labels
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Net Income (€M)', canvas.width / 2, 30);
}

// Update Bank KPIs
function updateBankKPIs() {
    const kpis = bankData.kpis;
    
    // Format large numbers
    const formatCurrency = (value) => {
        if (value >= 1000000000) {
            return '€' + (value / 1000000000).toFixed(1) + 'B';
        } else if (value >= 1000000) {
            return '€' + (value / 1000000).toFixed(0) + 'M';
        }
        return '€' + value.toLocaleString();
    };

    // Update bank KPI elements
    const updates = {
        'bank-total-assets': formatCurrency(kpis.assets),
        'bank-deposits': formatCurrency(kpis.deposits),
        'bank-loans': formatCurrency(kpis.loans),
        'bank-equity': formatCurrency(kpis.equity),
        'bank-roa': kpis.roa.toFixed(1) + '%',
        'bank-roe': kpis.roe.toFixed(1) + '%',
        'bank-tier1-ratio': kpis.tier1Ratio.toFixed(1) + '%'
    };

    Object.entries(updates).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Refresh charts with new data (for future backend integration)
function refreshCharts() {
    initAssetAllocationChart();
    initPerformanceChart();
    initBankFinancialsChart();
    updateBankKPIs();
}

// Export functions for external use
window.dashboardCharts = {
    init: initializeCharts,
    refresh: refreshCharts,
    updateBankKPIs: updateBankKPIs
};