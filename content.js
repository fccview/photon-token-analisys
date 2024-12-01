(function () {
    if (window.location.hostname !== 'photon-sol.tinyastro.io') return;

    const transactionHistory = new Map();
    let predictionDiv;
    let lastProcessedId = null;
    let filterSmallTrades = false;

    // Create UI elements once the DOM is ready for us
    document.addEventListener('DOMContentLoaded', () => {
        predictionDiv = dom.createPredictionDiv();
        const targetSection = document.querySelector('.p-show__widget.p-show__pair.u-py-s-lg');
        if (targetSection) {
            targetSection.insertBefore(predictionDiv, targetSection.firstChild);
        }
    });

    // Listen for filter toggle
    window.addEventListener('toggleTradeFilter', (event) => {
        filterSmallTrades = event.detail.filtered;
        // Clear history and reprocess current trades when filter changes
        transactionHistory.clear();
        checkForNewTransactions();
    });

    function checkForNewTransactions() {
        const rows = document.querySelectorAll('.c-trades-table__tr');
        console.log('Periodic check found rows:', rows.length);

        if (rows.length === 0) return;

        // Process all visible transactions (well kinda, if it's too fast it'll miss a bunch, that's why we have the filter)
        const currentTrades = [];
        for (const row of rows) {
            const type = row.querySelector('.c-trades-table__td:nth-child(2)').textContent.trim();
            const amount = parseFloat(row.querySelector('.c-trades-table__td:nth-child(7)').textContent.replace(/[^\d.-]/g, ''));
            const time = row.querySelector('.c-trades-table__td:nth-child(1)').textContent.trim();

            // Skip small trades if filter is enabled - Thi
            if (filterSmallTrades && amount < 0.01) continue;

            // Create a unique ID from the transaction details (I couldn't figure out a better way to avoid duplicates)
            const tradeId = `${time}-${type}-${amount}`;

            if (!isNaN(amount)) {
                currentTrades.push({ id: tradeId, type, amount });
            }
        }

        // Find new trades by comparing with our history
        const newTrades = currentTrades.filter(trade =>
            !transactionHistory.has(trade.id)
        );

        console.log('Found new trades:', newTrades.length);

        if (newTrades.length > 0) {
            processTrades(newTrades);
        }
    }

    function processTrades(trades) {
        let foundNewTransaction = false;

        trades.forEach(trade => {
            if (!transactionHistory.has(trade.id)) {
                transactionHistory.set(trade.id, {
                    type: trade.type,
                    amount: trade.amount,
                    time: Date.now()
                });
                foundNewTransaction = true;
            }
        });

        if (foundNewTransaction) {
            updateStats();
        }
    }

    function updateStats() {
        let totalBuyAmount = 0;
        let totalSellAmount = 0;
        let totalBuys = 0;
        let totalSells = 0;

        for (const [_, tx] of transactionHistory) {
            if (tx.type === 'Buy') {
                totalBuys++;
                totalBuyAmount += tx.amount;
            } else if (tx.type === 'Sell') {
                totalSells++;
                totalSellAmount += tx.amount;
            }
        }

        const currentStats = {
            transactions: transactionHistory.size,
            totalBuys,
            totalSells,
            totalBuyAmount,
            totalSellAmount
        };

        if (predictionDiv) {
            // Format data correctly for patternAnalysis
            const prediction = patternAnalysis.predictBuySell({
                current: {
                    buys: totalBuys,
                    sells: totalSells,
                    buyAmount: totalBuyAmount,
                    sellAmount: totalSellAmount
                }
            });

            console.log('Prediction:', prediction);
            dom.updatePredictionDiv(predictionDiv, prediction);
        } else {
            console.log('Warning: predictionDiv not found');
        }
    }

    // Check for new transactions every second
    setInterval(checkForNewTransactions, 1000);

    // Initial check - We need to wait for the DOM to be ready for us, sometimes it's not ready when the script runs
    setTimeout(checkForNewTransactions, 2000);
})();
