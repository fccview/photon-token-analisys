const walletStats = {
    getWalletThreatLevel(data) {
        const tradeCount = data.buys + data.sells;
        const totalVolume = data.buyAmount + data.sellAmount;

        if (tradeCount > 8 || totalVolume > 50) {
            return {
                level: 'high',
                icon: '🚨',
                class: 'u-color-red',
                message: 'High risk: Multiple transactions or high volume detected!'
            };
        }

        if (tradeCount > 4 || totalVolume > 20) {
            return {
                level: 'medium',
                icon: '⚠️',
                class: 'u-color-orange',
                message: 'Medium risk: Increased transactions or volume detected!'
            };
        }

        if (tradeCount > 2 || totalVolume > 10) {
            return {
                level: 'low',
                icon: '👀',
                class: 'u-color-yellow',
                message: 'Low risk: Moderate trading activity'
            };
        }

        return null;
    }
};
