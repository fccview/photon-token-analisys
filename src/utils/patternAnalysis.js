const patternAnalysis = {
    historicalData: new Map(),
    patterns: new Map(),
    MIN_TRANSACTIONS: 50,
    processedUIDs: new Set(),

    predictBuySell(allWalletStats) {
        const currentStats = this.aggregateCurrentStats(allWalletStats);
        const totalTransactions = currentStats.totalBuys + currentStats.totalSells;

        // Update historical data if we have transactions
        if (totalTransactions > 0) {
            this.updateHistoricalData(currentStats);
        }

        // Check if we have enough transactions
        if (totalTransactions < this.MIN_TRANSACTIONS) {
            return {
                action: 'WAIT',
                confidence: 0,
                message: `Need more data (${totalTransactions}/${this.MIN_TRANSACTIONS} transactions)`,
                buyAmount: currentStats.buyAmount,
                sellAmount: currentStats.sellAmount,
                totalBuys: currentStats.totalBuys,
                totalSells: currentStats.totalSells,
                totalTransactions
            };
        }

        // Calculate based on volume
        const totalVolume = currentStats.buyAmount + currentStats.sellAmount;
        const buyPercentage = totalVolume > 0 ? (currentStats.buyAmount / totalVolume) * 100 : 50;

        // Determine action and confidence
        let action, confidence, message;

        if (buyPercentage > 60) {
            action = 'BUY';
            confidence = Math.min(((buyPercentage - 60) * 2.5), 100);
            message = `Strong buying pressure: ${buyPercentage.toFixed(1)}% volume`;
        } else if (buyPercentage < 40) {
            action = 'SELL';
            confidence = Math.min(((40 - buyPercentage) * 2.5), 100);
            message = `Strong selling pressure: ${(100 - buyPercentage).toFixed(1)}% volume`;
        } else {
            action = 'WAIT';
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
            totalSells: currentStats.totalSells,
            totalTransactions
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
    },

    analyze() {
        const totalTx = this.buyVolumes.length + this.sellVolumes.length;

        // Check if we have enough transactions
        if (totalTx < this.MIN_TRANSACTIONS) {
            return {
                action: 'WAIT',
                confidence: `Need more data (${totalTx}/${this.MIN_TRANSACTIONS} transactions)`,
                buyVolume: this.getTotalBuyVolume(),
                sellVolume: this.getTotalSellVolume(),
                buyCount: this.buyVolumes.length,
                sellCount: this.sellVolumes.length,
                totalTx: totalTx
            };
        }

        // ... rest of analysis logic ...
    },

    getTotalBuyVolume() {
        return this.buyVolumes.reduce((sum, vol) => sum + vol, 0).toFixed(2);
    },

    getTotalSellVolume() {
        return this.sellVolumes.reduce((sum, vol) => sum + vol, 0).toFixed(2);
    }
};

window.patternAnalysis = patternAnalysis;
