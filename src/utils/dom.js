const dom = {
  createPredictionDiv() {
    const predictionDiv = document.createElement('div');
    predictionDiv.id = 'prediction-div';
    predictionDiv.className = 'p-show__widget p-show__info u-p-0 u-mb-xs';

    predictionDiv.innerHTML = `
      <div class="buy-sell-prediction" style="padding-bottom: 1em">
        <h6 class="u-font-size-zh-3xs u-p-xs" style="text-align: center; padding-bottom: 0.2em!important; margin-bottom: 1em!important; border-bottom: 1px solid rgba(255,255,255,0.1)">
          Token Analysis
        </h6>
        <div class="js-info__content" style="padding: 0 1.2em;">
          <div id="prediction-content">
            <p style="text-align: center;">Analyzing market trends...</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 10px; padding: 0 1.2em;">
          <button id="filter-trades-btn" style="
            padding: 6px 12px;
            font-size: 11px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 20px;
            &:hover {
              background: rgba(255, 255, 255, 0.1);
            }
          ">
            Improve accuracy (filter > 0.01 SOL)
          </button>
        </div>
        <div style="text-align: center; font-size: 10px; color: #666; padding: 0 1.2em;">
          ⚠️ This is not financial advice. Trade at your own risk.
        </div>
      </div>
    `;

    const filterBtn = predictionDiv.querySelector('#filter-trades-btn');
    filterBtn.addEventListener('click', () => {
      const filterBtn = document.querySelector('.c-grid-table__th:nth-child(7) .c-icon[data-icon="filter"]');
      if (filterBtn) filterBtn.click();

      setTimeout(() => {
        const minInput = document.querySelector('.c-modal__content input[placeholder="min"]');
        if (minInput) {
          minInput.value = '0.01';
          minInput.dispatchEvent(new Event('input', { bubbles: true }));

          const applyBtn = document.querySelector('.c-modal__content .l-row-gap--xxs > div:nth-child(2) button');
          if (applyBtn) {
            console.log('Clicking apply button');
            applyBtn.click();
          } else {
            console.log('Apply button not found');
          }
        }
      }, 200);
    });

    return predictionDiv;
  },

  updatePredictionDiv(predictionDiv, prediction) {
    if (!prediction) return;

    const predictionContent = predictionDiv.querySelector('#prediction-content');
    const buyAmount = prediction.buyAmount || 0;
    const sellAmount = prediction.sellAmount || 0;
    const totalBuys = prediction.totalBuys || 0;
    const totalSells = prediction.totalSells || 0;

    predictionContent.innerHTML = `
      <div style="text-align: center;">
        <div style="margin-bottom: 15px;">
          <span class="u-font-size-zh-2xs ${prediction.action === 'BUY' ? 'u-color-green' : prediction.action === 'SELL' ? 'u-color-red' : 'u-color-yellow'}" 
                style="font-size: 28px; font-weight: bold; display: block;">
            ${prediction.action === 'BUY' ? '📈' : prediction.action === 'SELL' ? '📉' : '📊'} ${prediction.action}
          </span>
          <div style="margin-top: 5px;">
            <div style="font-size: 12px; color: #888;">Confidence</div>
            <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 6px; margin: 5px 0;">
              <div style="background: ${prediction.action === 'BUY' ? '#4CAF50' : prediction.action === 'SELL' ? '#f44336' : '#888'}; 
                                  width: ${prediction.confidence}%; height: 100%; border-radius: 10px;"></div>
            </div>
          </div>
        </div>
        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; margin-bottom: 15px;">
          <p style="margin: 0; font-size: 14px;">${prediction.message}</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div style="background: rgba(0,255,0,0.05); padding: 10px; border-radius: 6px;">
            <p style="margin: 0; font-size: 12px; color: #888;">Buy Volume</p>
            <p style="margin: 5px 0 0 0; font-size: 16px; color: #4CAF50;">
              ${buyAmount.toFixed(2)} SOL
            </p>
            <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid rgba(76,175,80,0.1);">
              <p style="margin: 0; font-size: 11px; color: #888;">Transactions</p>
              <p style="margin: 2px 0 0 0; font-size: 14px; color: #4CAF50;">
                ${totalBuys}
              </p>
            </div>
          </div>
          <div style="background: rgba(255,0,0,0.05); padding: 10px; border-radius: 6px;">
            <p style="margin: 0; font-size: 12px; color: #888;">Sell Volume</p>
            <p style="margin: 5px 0 0 0; font-size: 16px; color: #f44336;">
              ${sellAmount.toFixed(2)} SOL
            </p>
            <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid rgba(244,67,54,0.1);">
              <p style="margin: 0; font-size: 11px; color: #888;">Transactions</p>
              <p style="margin: 2px 0 0 0; font-size: 14px; color: #f44336;">
                ${totalSells}
              </p>
            </div>
          </div>
        </div>
        <div style="background: rgba(255,255,255,0.02); border-radius: 6px; padding: 8px; margin-top: 5px;">
          <p style="margin: 0; font-size: 11px; color: #888;">Total Transactions</p>
          <p style="margin: 2px 0 0 0; font-size: 14px; color: #aaa;">
            ${totalBuys + totalSells}
          </p>
        </div>
      </div>
    `;
  }
};
