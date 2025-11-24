export default function generateRandomCandles(count = 150, startPrice = 100) {
  const candles = [];
  let lastClose = startPrice;

  for (let i = 0; i < count; i++) {
    const volatility = 2 + Math.random() * 3;

    const open = +(lastClose + (Math.random() - 0.5) * volatility).toFixed(2);
    const change = (Math.random() - 0.5) * volatility * 2;
    const close = +(open + change).toFixed(2);

    const high =
      Math.max(open, close) + +(Math.random() * volatility).toFixed(2);
    const low =
      Math.min(open, close) - +(Math.random() * volatility).toFixed(2);

    candles.push({
      time: i,
      open: Number(open),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close),
    });

    lastClose = close;
  }

  return candles;
}
