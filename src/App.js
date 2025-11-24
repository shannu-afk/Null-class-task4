import React, { useEffect, useMemo, useState } from "react";
import CandlestickChart from "./components/CandlestickChart";
import PatternLegend from "./components/PatternLegend";
import generateRandomCandles from "./utils/generateCandles";
import detectPatterns from "./utils/detectPatterns";

export default function App() {
  const [candles, setCandles] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState("all");
  const [highlightOnly, setHighlightOnly] = useState(false);

  useEffect(() => {
    const data = generateRandomCandles(150, 100);
    console.log("Generated Data:", data);
    setCandles(data);
  }, []);

  const patternMap = useMemo(() => (candles.length ? detectPatterns(candles) : {}), [candles]);
  const patternCounts = useMemo(() => {
    const counts = { doji: 0, hammer: 0, invertedHammer: 0, bullishEngulfing: 0, bearishEngulfing: 0 };
    Object.values(patternMap).forEach((p) => { if (counts[p] !== undefined) counts[p] += 1; });
    return counts;
  }, [patternMap]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{
        background: "linear-gradient(90deg,#7dd3fc,#a78bfa,#34d399)", WebkitBackgroundClip: "text",
        color: "transparent", marginBottom: 12
      }}>Candlestick Pattern Recognition</h1>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
            <label>
              <span style={{ marginRight: 8 }}>Filter:</span>
              <select
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 8 }}
              >
                <option value="all">All patterns</option>
                <option value="doji">Doji</option>
                <option value="hammer">Hammer</option>
                <option value="invertedHammer">Inverted Hammer</option>
                <option value="bullishEngulfing">Bullish Engulfing</option>
                <option value="bearishEngulfing">Bearish Engulfing</option>
              </select>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" checked={highlightOnly} onChange={(e) => setHighlightOnly(e.target.checked)} />
              Highlight selected only
            </label>
            <div style={{ marginLeft: "auto", fontSize: 12, background: "#f1f5f9", padding: "6px 10px", borderRadius: 8 }}>
              Doji: <b>{patternCounts.doji}</b> · Hammer: <b>{patternCounts.hammer}</b> · Inverted: <b>{patternCounts.invertedHammer}</b> · Bull Engulf: <b>{patternCounts.bullishEngulfing}</b> · Bear Engulf: <b>{patternCounts.bearishEngulfing}</b>
            </div>
          </div>
          <CandlestickChart data={candles} selectedPattern={selectedPattern} highlightOnly={highlightOnly} />
        </div>
        <PatternLegend />
      </div>
    </div>
  );
}
