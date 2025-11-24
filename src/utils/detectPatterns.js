export default function detectPatterns(candles) {
  let patterns = {};

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];

    const body = Math.abs(c.close - c.open);
    const range = c.high - c.low;
    const upperShadow = c.high - Math.max(c.open, c.close);
    const lowerShadow = Math.min(c.open, c.close) - c.low;

    // Doji
    if (range > 0 && body <= range * 0.1) {
      patterns[i] = "doji";
      continue;
    }

    // Hammer
    if (lowerShadow > body * 2 && upperShadow <= body * 0.3) {
      patterns[i] = "hammer";
      continue;
    }

    // Inverted Hammer
    if (upperShadow > body * 2 && lowerShadow <= body * 0.3) {
      patterns[i] = "invertedHammer";
      continue;
    }

    // Engulfing
    if (i > 0) {
      const prev = candles[i - 1];

      // Bullish Engulfing
      if (
        prev.close < prev.open &&
        c.close > c.open &&
        c.open <= prev.close &&
        c.close >= prev.open
      ) {
        patterns[i] = "bullishEngulfing";
        continue;
      }

      // Bearish Engulfing
      if (
        prev.close > prev.open &&
        c.close < c.open &&
        c.open >= prev.close &&
        c.close <= prev.open
      ) {
        patterns[i] = "bearishEngulfing";
        continue;
      }
    }
  }

  return patterns;
}
