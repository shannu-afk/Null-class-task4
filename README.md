# Candlestick Pattern Recognition (Frontend)

An interactive React + D3 visualization that generates random OHLC data, detects common candlestick patterns, and highlights them on a colorful, modern chart. The project is fully client-side and does not require a backend.

## Table of Contents
- Overview
- Features
- Demo (How it looks)
- Tech Stack
- Project Structure
- Getting Started
- Available Scripts
- How It Works
- Detected Patterns
- UI Controls
- Notes on Backend
- Customization
- Troubleshooting

## Overview
This app mimics the analysis experience of trading terminals by:
- Generating synthetic candlestick data
- Detecting patterns like Doji, Hammer, Inverted Hammer, Bullish and Bearish Engulfing
- Highlighting detected patterns using distinct colors, glow effects, tooltips, and a legend
- Providing controls to filter and focus on specific patterns

## Features
- Random OHLC data generator (browser-based)
- Pattern detection on the client
- Colorful chart with gradients, gridlines, and modern styling
- Tooltips with high-contrast floating card and edge-aware positioning
- Pattern legend and live pattern counts
- Filters: select a single pattern and optionally highlight only that pattern
- Responsive chart width inside the layout

## Demo (How it looks)
- Candles are drawn with D3; bullish/bearish candles use gradients
- Detected patterns are recolored per type and outlined with a glow
- Tooltip appears on hover showing OHLC values and the detected pattern
- A right-side legend explains each pattern
- A control bar provides a pattern filter, a highlight-only toggle, and pattern counts

## Tech Stack
- React (Create React App)
- D3.js for rendering and scales
- Plain CSS-in-JS styles for quick theming

## Project Structure
```
my-app/
  public/
  src/
    components/
      CandlestickChart.js   # D3 chart + pattern highlighting
      PatternLegend.js      # Pattern legend panel
    utils/
      generateCandles.js    # Random OHLC generator (frontend)
      detectPatterns.js     # Pattern detection logic
    App.js                  # App layout + controls + counts
    index.js                # CRA entry
  README.md                 # This file
  package.json
```
Note: A backend folder exists in the repository but is not used by this app.

## Getting Started
1. Install dependencies
   - Navigate to my-app and install packages:
     - npm install
2. Run the app
   - npm start
   - Open http://localhost:3000

## Available Scripts
- npm start
  - Runs the development server at http://localhost:3000
- npm run build
  - Builds the production bundle into the build/ folder
- npm test
  - Runs tests (CRA defaults)

## How It Works
- Data generation (src/utils/generateCandles.js)
  - Produces an array of candles [{ time, open, high, low, close }]
- Pattern detection (src/utils/detectPatterns.js)
  - Returns a map: { index: patternType }
  - Types include: doji, hammer, invertedHammer, bullishEngulfing, bearishEngulfing
- Chart rendering (src/components/CandlestickChart.js)
  - Renders candles with D3 scales and SVG
  - Applies gradients for bull/bear by default
  - Applies strong colors + glow for detected patterns
  - Tooltip shows OHLC + pattern; positioned to avoid clipping
- App state and controls (src/App.js)
  - Computes patternMap and live counts
  - Controls: pattern filter and highlight-only toggle
  - Passes selectedPattern/highlightOnly to the chart

## Detected Patterns
- Doji — small body relative to total range (market indecision)
- Hammer — long lower shadow, small body (bullish reversal context)
- Inverted Hammer — long upper shadow, small body (bullish reversal context)
- Bullish Engulfing — green candle fully engulfs previous red body
- Bearish Engulfing — red candle fully engulfs previous green body

These implementations are heuristic and simplified for educational/visualization purposes.

## UI Controls
- Filter (dropdown)
  - All patterns, Doji, Hammer, Inverted Hammer, Bullish Engulfing, Bearish Engulfing
- Highlight selected only (checkbox)
  - When on, non-matching candles are heavily faded so the selected pattern stands out
- Pattern counts (right side in control bar)
  - Live counts for each detected pattern

## Notes on Backend
- The current application is fully frontend. No API calls or server endpoints are used.
- The backend folder can be safely ignored or removed if not needed.
- If you later want real data or persistence, you can implement endpoints (e.g., /api/candles) and replace the generator with fetch calls in App.js.

## Customization
- Candle count and starting price
  - In App.js, change generateRandomCandles(150, 100) to adjust the number of candles and starting price
- Colors and gradients
  - Edit gradient stops and pattern colors in CandlestickChart.js
- Detection thresholds
  - Tweak the logic inside detectPatterns.js to make patterns more or less strict
- Layout
  - The legend and controls are plain React components and inline styles; adapt as needed

## Troubleshooting
- Overlapping x-axis ticks: the chart samples every 10th tick; reduce further if candles increase
- Tooltip not visible or clipped: it uses fixed positioning with edge-avoidance; ensure the app is not inside an iframe with restrictive boundaries
- Nothing renders: check the console for JavaScript errors and ensure npm start is running

---
This project is intended for educational and demo purposes and is not financial advice. Contributions and improvements are welcome.
