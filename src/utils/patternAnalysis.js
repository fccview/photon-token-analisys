const patternAnalysis = {
    historicalData: new Map(),
    patterns: new Map(),

    predictBuySell(allWalletStats) {
        const currentStats = this.aggregateCurrentStats(allWalletStats);
        this.updateHistoricalData(currentStats);

        // Calculate buy pressure
        const totalVolume = currentStats.buyAmount + currentStats.sellAmount;
        const buyPercentage = totalVolume > 0 ? (currentStats.buyAmount / totalVolume) * 100 : 50;

        // Calculate transaction ratio
        const totalTx = currentStats.totalBuys + currentStats.totalSells;
        const buyTxPercentage = totalTx > 0 ? (currentStats.totalBuys / totalTx) * 100 : 50;

        // Weight volume more heavily than transaction count
        const weightedBuyPressure = (buyPercentage * 0.7) + (buyTxPercentage * 0.3);

        // Determine action and confidence
        let action, confidence, message;

        if (weightedBuyPressure > 60) {
            action = 'BUY';
            confidence = Math.min(((weightedBuyPressure - 60) * 2.5), 100);
            message = `Strong buying pressure: ${buyPercentage.toFixed(1)}% volume, ${buyTxPercentage.toFixed(1)}% transactions`;
        } else if (weightedBuyPressure < 40) {
            action = 'SELL';
            confidence = Math.min(((40 - weightedBuyPressure) * 2.5), 100);
            message = `Strong selling pressure: ${(100 - buyPercentage).toFixed(1)}% volume, ${(100 - buyTxPercentage).toFixed(1)}% transactions`;
        } else {
            action = 'HOLD';
            confidence = 50;
            message = 'Market is balanced';
        }

        return {
            action,
            confidence,
            message,
            buyAmount: currentStats.buyAmount,
            sellAmount: currentStats.sellAmount,
            totalBuys: currentStats.totalBuys,
            totalSells: currentStats.totalSells
        };
    },

    aggregateCurrentStats(allWalletStats) {
        const stats = allWalletStats.current || {};
        return {
            totalBuys: stats.buys || 0,
            totalSells: stats.sells || 0,
            buyAmount: stats.buyAmount || 0,
            sellAmount: stats.sellAmount || 0
        };
    },

    updateHistoricalData(currentStats) {
        const timestamp = Date.now();
        this.historicalData.set(timestamp, currentStats);

        // Keep only last 24 hours
        const oneDayAgo = timestamp - (24 * 60 * 60 * 1000);
        for (const [time, _] of this.historicalData) {
            if (time < oneDayAgo) {
                this.historicalData.delete(time);
            }
        }
    }
};

window.patternAnalysis = patternAnalysis;
