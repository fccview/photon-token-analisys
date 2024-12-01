# Token Analysis Extension for Photon SOL

A Chrome extension that analyzes trading patterns on photon-sol.tinyastro.io to provide market sentiment insights.

## Support the Project ❤️

If you find this tool helpful, consider supporting me, every donation helps me continue creating useful tools for the community:

```
SOL: 3VpNWv517ccnshXFCKYgf3GeAxk4DzhrowhQEa3rrUrn
ETH: 0xfe89834C92C399E720F457bB73fEa1EFe1D0e17D
```

## Features

- Real-time trade analysis
- Buy/Sell pattern detection
- Trade volume tracking
- Visual prediction indicators

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## File Structure

```
├── manifest.json
├── content.js
├── src/
│   ├── utils/
│       ├── dom.js
│       ├── walletStats.js
│       ├── patternAnalysis.js
└── icons/
    └── icon128.png
```

## Code Examples

### Manifest Configuration
```
{
  "manifest_version": 2,
  "name": "Market Sentiment Analysis",
  "version": "1.0",
  "description": "Analyzes trading patterns on photon-sol.tinyastro.io",
  "permissions": [
    "*://photon-sol.tinyastro.io/*"
  ],
  "content_scripts": [
    {
      "matches": ["*://photon-sol.tinyastro.io/*"],
      "js": ["content.js", "dom.js", "patternAnalysis.js"]
    }
  ],
  "icons": {
    "128": "icons/icon128.png"
  }
}
```

### Usage Example
The extension automatically activates when visiting photon-sol.tinyastro.io. It adds a sentiment analysis panel showing:
- Current market sentiment
- Buy/Sell ratio
- Volume analysis
- Trading patterns

Use the "Improve accuracy" button to filter out bot transactions (< 0.01 SOL).

## Development

To modify the extension:
1. Update code in respective files
2. Reload the extension in Chrome
3. Refresh the target page

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Disclaimer

This extension is for informational purposes only. Trading decisions should not be based solely on its analysis. Always do your own research.