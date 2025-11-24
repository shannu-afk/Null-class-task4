import React from 'react';

export default function PatternLegend() {
  return (
    <div style={{ padding: 12, borderRadius: 8, background: '#f7f7f7' }}>
      <h3 style={{ marginTop: 0 }}>Pattern Legend</h3>
      <ul style={{ paddingLeft: 18 }}>
        <li><b>Doji</b> — small body; indicates market indecision.</li>
        <li><b>Hammer</b> — long lower shadow; signals potential bullish reversal.</li>
        <li><b>Inverted Hammer</b> — long upper shadow; bullish reversal during downtrend.</li>
        <li><b>Bullish Engulfing</b> — green candle fully engulfs previous red candle.</li>
        <li><b>Bearish Engulfing</b> — red candle fully engulfs previous green candle.</li>
      </ul>
    </div>
  );
}
