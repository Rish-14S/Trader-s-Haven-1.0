function loadTradingViewChart(symbol) {
    new TradingView.widget({
        "width": "100%",
        "height": 400,
        "symbol": `NASDAQ:${symbol}`, 
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview-widget"
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const defaultSymbol = "AAPL";
    loadTradingViewChart(defaultSymbol);

    document.getElementById("select-stock").addEventListener("click", function() {
        const selectedStock = document.getElementById("stock-dropdown").value;
        
        fetch(`/get_stock_data/${selectedStock}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(stockData => {
                console.log(stockData);
                loadTradingViewChart(selectedStock); 
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });
});


const themeSwitch = document.getElementById('theme-switch');
const body = document.body;

themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
    }
});

function fetchMarketSentiment() {
    fetch('/get_market_sentiment')
        .then(response => response.json())
        .then(data => {
            const sentimentCircles = document.querySelectorAll('.sentiment-circle');
            sentimentCircles.forEach(circle => circle.classList.remove('active'));
            
            const activeCircle = document.querySelector(`.sentiment-circle.${data.sentiment}`);
            if (activeCircle) {
                activeCircle.classList.add('active');
            }
        })
        .catch(error => console.error('Error fetching market sentiment:', error));
}

fetchMarketSentiment();
setInterval(fetchMarketSentiment, 5 * 60 * 1000);
