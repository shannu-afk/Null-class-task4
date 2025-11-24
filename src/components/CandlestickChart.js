// CandlestickChart.js
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import detectPatterns from "../utils/detectPatterns";

export default function CandlestickChart({ data, selectedPattern = "all", highlightOnly = false }) {
  const chartRef = useRef(null);

  useEffect(() => {
    drawChart();
  }, [data, selectedPattern, highlightOnly]);

  function drawChart() {
    const container = chartRef.current;
    container.innerHTML = "";

    if (!data || data.length === 0) return;

    const width = Math.min(1000, (container.parentElement?.clientWidth || 960) - 280);
    const height = 480;
    const margin = { top: 16, right: 24, bottom: 24, left: 56 };

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "transparent")
      .style("borderRadius", "16px")
      .style("boxShadow", "0 10px 28px rgba(0,0,0,0.35)");

    // Colorful background gradient
    const defs = svg.append("defs");

    const bgGrad = defs
      .append("linearGradient")
      .attr("id", "bgGrad")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
    bgGrad.append("stop").attr("offset", "0%").attr("stop-color", "#0b1020");
    bgGrad.append("stop").attr("offset", "50%").attr("stop-color", "#0f1a2e");
    bgGrad.append("stop").attr("offset", "100%").attr("stop-color", "#101827");

    // Candle gradients
    const bullGrad = defs.append("linearGradient").attr("id", "bullGrad");
    bullGrad.append("stop").attr("offset", "0%").attr("stop-color", "#34d399");
    bullGrad.append("stop").attr("offset", "100%").attr("stop-color", "#059669");

    const bearGrad = defs.append("linearGradient").attr("id", "bearGrad");
    bearGrad.append("stop").attr("offset", "0%").attr("stop-color", "#fb7185");
    bearGrad.append("stop").attr("offset", "100%").attr("stop-color", "#e11d48");

    // Glow filter for highlighted patterns
    const glow = defs.append("filter").attr("id", "glowWhite");
    glow.append("feGaussianBlur").attr("stdDeviation", 2.2).attr("result", "coloredBlur");
    const feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Background rect using gradient
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("rx", 16)
      .attr("fill", "url(#bgGrad)");

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d, i) => i))
      .range([0, chartWidth])
      .padding(0.35);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)])
      .nice()
      .range([chartHeight, 0]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(xScale.domain().filter((d, i) => i % 10 === 0))
      .tickSizeOuter(0);

    g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis)
      .call((gSel) => gSel.selectAll("text").style("fill", "#9aa4b2"))
      .call((gSel) => gSel.selectAll("path, line").attr("stroke", "#1e293b"));

    const yAxis = d3.axisLeft(yScale).ticks(8).tickSizeOuter(0);

    g.append("g")
      .call(yAxis)
      .call((gSel) => gSel.selectAll("text").style("fill", "#cbd5e1"))
      .call((gSel) => gSel.selectAll("path, line").attr("stroke", "#1e293b"));

    // Horizontal gridlines
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yScale.ticks(8))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", chartWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#334155")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3 3")
      .attr("opacity", 0.6);

    const patternMap = detectPatterns(data);

    const tooltip = d3
      .select(container)
      .append("div")
      .style("position", "fixed")
      .style("padding", "10px 12px")
      .style("background", "rgba(15, 23, 42, 0.96)")
      .style("color", "#e2e8f0")
      .style("border", "1px solid #334155")
      .style("borderRadius", "8px")
      .style("backdropFilter", "blur(4px)")
      .style("font", "12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif")
      .style("pointerEvents", "none")
      .style("zIndex", 9999)
      .style("opacity", 0);

    g.selectAll(".candle")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "candle")
      .each(function (d, i) {
        const group = d3.select(this);
        const isBull = d.close > d.open;
        let color = isBull ? "#4ade80" : "#f87171";
        const thisPattern = patternMap[i];
        if (thisPattern) {
          if (thisPattern === "hammer") color = "#10b981";
          if (thisPattern === "doji") color = "#facc15";
          if (thisPattern === "bullishEngulfing") color = "#60a5fa";
          if (thisPattern === "bearishEngulfing") color = "#fb7185";
          if (thisPattern === "invertedHammer") color = "#a78bfa";
        }
        const isSelected = selectedPattern === "all" || thisPattern === selectedPattern;

        const wickColor = isSelected ? color : "#64748b";
        const wickOpacity = isSelected ? 0.95 : (highlightOnly ? 0.15 : 0.45);

        group
          .append("line")
          .attr("x1", xScale(i) + xScale.bandwidth() / 2)
          .attr("y1", yScale(d.high))
          .attr("x2", xScale(i) + xScale.bandwidth() / 2)
          .attr("y2", yScale(d.low))
          .attr("stroke", wickColor)
          .attr("stroke-width", 2)
          .attr("opacity", wickOpacity);

        const fill = thisPattern ? color : (isBull ? "url(#bullGrad)" : "url(#bearGrad)");
        const strokeCol = thisPattern ? color : "none";
        const rectOpacity = isSelected ? 1 : (highlightOnly ? 0.18 : 0.5);
        const rectFilter = isSelected && thisPattern ? "url(#glowWhite)" : null;

        group
          .append("rect")
          .attr("x", xScale(i))
          .attr("y", yScale(Math.max(d.open, d.close)))
          .attr("width", xScale.bandwidth())
          .attr("height", Math.abs(yScale(d.open) - yScale(d.close)))
          .attr("fill", fill)
          .attr("stroke", strokeCol)
          .attr("opacity", rectOpacity)
          .attr("stroke-width", thisPattern ? 2 : 0)
          .attr("filter", rectFilter)
          .on("mouseover", () => {
            const pattern = thisPattern;
            const chipColor = pattern === "hammer" ? "#22c55e" :
                              pattern === "doji" ? "#eab308" :
                              pattern === "bullishEngulfing" ? "#60a5fa" :
                              pattern === "bearishEngulfing" ? "#f43f5e" :
                              pattern === "invertedHammer" ? "#8b5cf6" : "#94a3b8";
            tooltip
              .style("opacity", 1)
              .html(
                `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                   <div style="width:8px;height:8px;border-radius:50%;background:${chipColor}"></div>
                   <strong>Day ${i + 1}</strong>
                 </div>
                 <div>Open: <b>${d.open}</b></div>
                 <div>High: <b>${d.high}</b></div>
                 <div>Low: <b>${d.low}</b></div>
                 <div>Close: <b>${d.close}</b></div>
                 ${pattern ? `<div style='margin-top:6px;color:${chipColor}'>Pattern: <b>${pattern}</b></div>` : ""}`
              );
          })
          .on("mousemove", (event) => {
            const offset = 14;
            let left = event.clientX + offset;
            let top = event.clientY + offset;
            const { innerWidth, innerHeight } = window;
            const rect = tooltip.node().getBoundingClientRect();
            if (left + rect.width > innerWidth - 8) left = event.clientX - rect.width - offset;
            if (top + rect.height > innerHeight - 8) top = event.clientY - rect.height - offset;
            tooltip.style("left", left + "px");
            tooltip.style("top", top + "px");
          })
          .on("mouseout", () => tooltip.style("opacity", 0));
      });
  }

  return <div ref={chartRef}></div>;
}
