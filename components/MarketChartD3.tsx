"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface ChartDataPoint {
  label: string;
  value: number;
}

interface MarketChartD3Props {
  data: ChartDataPoint[];
  strokeColor?: string;
}

export default function MarketChartD3({
  data,
  strokeColor = "#EF4444",
}: MarketChartD3Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 260 });
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Handle responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      setDimensions((prev) => ({ ...prev, width }));
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Render D3 chart
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || !data || data.length === 0)
      return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clean up previous renders

    const margin = { top: 15, right: 10, bottom: 25, left: 45 };
    const width = dimensions.width;
    const height = dimensions.height;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Define scales
    const xScale = d3
      .scalePoint()
      .domain(data.map((_, i) => String(i)))
      .range([0, innerWidth]);

    const yMin = d3.min(data, (d) => d.value) || 0;
    const yMax = d3.max(data, (d) => d.value) || 0;
    const padding = (yMax - yMin) * 0.1 || 10;

    const yScale = d3
      .scaleLinear()
      .domain([Math.max(0, yMin - padding), yMax + padding])
      .range([innerHeight, 0]);

    // Create Main Chart Group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define Gradient
    const defs = svg.append("defs");
    const areaGradient = defs
      .append("linearGradient")
      .attr("id", "chart-area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    areaGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", strokeColor)
      .attr("stop-opacity", 0.28);

    areaGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", strokeColor)
      .attr("stop-opacity", 0.0);

    // Draw Grid Lines (Horizontal)
    const yTicks = yScale.ticks(4);
    g.selectAll(".grid-line")
      .data(yTicks)
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "rgba(255, 255, 255, 0.04)")
      .attr("stroke-width", 1);

    // Area Generator
    const areaGenerator = d3
      .area<ChartDataPoint>()
      .x((_, i) => xScale(String(i)) || 0)
      .y0(innerHeight)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Line Generator
    const lineGenerator = d3
      .line<ChartDataPoint>()
      .x((_, i) => xScale(String(i)) || 0)
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Draw Area
    g.append("path")
      .datum(data)
      .attr("d", areaGenerator)
      .attr("fill", "url(#chart-area-gradient)");

    // Draw Line
    g.append("path")
      .datum(data)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", strokeColor)
      .attr("stroke-width", 2);

    // Add Axes
    // X Axis
    const xAxisTicks = data.filter(
      (_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1,
    );
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues(
            xAxisTicks.map((_, i) => {
              const index = data.findIndex(
                (d) => d.label === xAxisTicks[i].label,
              );
              return String(index);
            }),
          )
          .tickFormat((d) => data[Number(d)].label)
          .tickSize(0)
          .tickPadding(8),
      )
      .call((g) => g.select(".domain").remove()) // Remove axis line
      .selectAll("text")
      .attr("fill", "rgba(255, 255, 255, 0.4)")
      .attr("font-size", "10px")
      .attr("font-weight", "500");

    // Y Axis
    g.append("g")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(4)
          .tickFormat((d) => `$${d3.format(",.0f")(d)}`)
          .tickSize(0)
          .tickPadding(8),
      )
      .call((g) => g.select(".domain").remove()) // Remove axis line
      .selectAll("text")
      .attr("fill", "rgba(255, 255, 255, 0.4)")
      .attr("font-size", "10px")
      .attr("font-weight", "500");

    // Interactive Hover Elements (Crosshairs, Tooltip dots)
    const crosshair = g
      .append("line")
      .attr("class", "crosshair")
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "rgba(255, 255, 255, 0.2)")
      .attr("stroke-dasharray", "3,3")
      .attr("stroke-width", 1)
      .style("display", "none");

    const hoverDot = g
      .append("circle")
      .attr("r", 5)
      .attr("fill", strokeColor)
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 1.5)
      .style("display", "none");

    // Pointer event handler
    const pointerOverlay = g
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "transparent")
      .style("cursor", "crosshair");

    pointerOverlay.on("pointermove", (event) => {
      const [mouseX] = d3.pointer(event);

      // Find closest data point
      const range = xScale.range();
      const domain = xScale.domain();

      // Calculate closest scale index
      let closestIdx = 0;
      let minDiff = Infinity;
      domain.forEach((d, i) => {
        const xPos = xScale(d) || 0;
        const diff = Math.abs(xPos - mouseX);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      });

      const closestPoint = data[closestIdx];
      const cx = xScale(String(closestIdx)) || 0;
      const cy = yScale(closestPoint.value);

      // Update positions
      crosshair.attr("x1", cx).attr("x2", cx).style("display", "block");

      hoverDot.attr("cx", cx).attr("cy", cy).style("display", "block");

      setHoveredPoint(closestPoint);
      setTooltipPos({
        x: cx + margin.left,
        y: cy + margin.top,
      });
    });

    pointerOverlay.on("pointerleave", () => {
      crosshair.style("display", "none");
      hoverDot.style("display", "none");
      setHoveredPoint(null);
    });
  }, [data, dimensions, hoveredPoint]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[260px] bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-4 flex flex-col justify-end"
    >
      <svg ref={svgRef} className="w-full h-full" />

      {/* Tooltip Overlay */}
      {hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none bg-[#1D1D22] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 rounded-[12px] shadow-lg flex flex-col gap-0.5 text-left transition-all duration-75"
          style={{
            left: `${tooltipPos.x + 12}px`,
            top: `${tooltipPos.y - 45}px`,
            transform:
              tooltipPos.x + 150 > dimensions.width
                ? "translateX(-115%)"
                : "none",
          }}
        >
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {hoveredPoint.label}
          </span>
          <span className="text-sm font-semibold text-white">
            $
            {hoveredPoint.value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      )}
    </div>
  );
}
