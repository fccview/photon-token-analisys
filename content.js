(function () {
    if (window.location.hostname !== 'photon-sol.tinyastro.io') return;

    // Store ALL transactions persistently
    const allTransactions = [];
    const processedUIDs = new Set();
    let predictionDiv;
    let filterSmallTrades = false;

    // Create UI elements once the DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.dom) {
            console.error('DOM utilities not loaded!');
            return;
        }

        predictionDiv = window.dom.createPredictionDiv();
        const targetSection = document.querySelector('.p-show__widget.p-show__pair.u-py-s-lg');
        if (targetSection) {
            targetSection.insertBefore(predictionDiv, targetSection.firstChild);
        }
    });

    window.addEventListener('toggleTradeFilter', (event) => {
        filterSmallTrades = event.detail.filtered;
        processedUIDs.clear();
        checkForNewTransactions();
    });

    function checkForNewTransactions() {
        const rows = document.querySelectorAll('.c-trades-table__tr');

        if (rows.length === 0) return;

        // Process only new transactions, this is suck a pain in the ass i swear.
        rows.forEach(row => {
            const uid = row.getAttribute('data-uid');
            if (!uid || processedUIDs.has(uid)) return;

            const type = row.querySelector('.c-trades-table__td:nth-child(2)').textContent.trim();
            const amount = parseFloat(row.querySelector('.c-trades-table__td:nth-child(7)').textContent.replace(/[^\d.-]/g, ''));

            if (!isNaN(amount)) {
                // Add to our persistent storage - @todo - we should probably limit this to the last 1000 or so transactions
                allTransactions.push({ uid, type, amount });
                processedUIDs.add(uid);
            }
        });

        updateStats();
    }

    function updateStats() {
        const stats = allTransactions.reduce((acc, trade) => {
            if (trade.type === 'Buy') {
                acc.totalBuys++;
                acc.totalBuyAmount += trade.amount;
            } else if (trade.type === 'Sell') {
                acc.totalSells++;
                acc.totalSellAmount += trade.amount;
            }
            return acc;
        }, {
            totalBuys: 0,
            totalSells: 0,
            totalBuyAmount: 0,
            totalSellAmount: 0
        });

        // Update UI with complete stats
        const prediction = window.patternAnalysis.predictBuySell({
            current: {
                buys: stats.totalBuys,
                sells: stats.totalSells,
                buyAmount: stats.totalBuyAmount,
                sellAmount: stats.totalSellAmount,
                totalTransactions: stats.totalBuys + stats.totalSells
            }
        });

        const predictionDiv = document.getElementById('prediction-div');
        if (predictionDiv && window.dom) {
            window.dom.updatePredictionDiv(predictionDiv, prediction);
        }
    }

    // Check for new transactions every second
    setInterval(checkForNewTransactions, 1000);

    // Initial check - We need to wait for the DOM to be ready for us, sometimes it's not ready when the script runs
    setTimeout(checkForNewTransactions, 2000);
})();
