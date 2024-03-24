import React, { useRef, useState, useEffect } from "react";
import useResizeObserver from "../hooks/useResizeObserver";
import { axisBottom, axisRight, curveCardinal, line, max, scaleLinear, select } from "d3";
import { lineData } from "../mock/lineData";
import "../index.css";

export default function LineChart() {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [data, setData] = useState(lineData);
  useEffect(() => {
    const svg = select(svgRef.current);
    const maxY=max(data)
    if (!dimensions) return;
    const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([0, dimensions.width]);
    const xAxis=axisBottom(xScale).ticks(7).tickFormat(index=>index+1)
    const yScale=scaleLinear().domain([0,maxY]).range([dimensions.height,0])
    const yAxis=axisRight(yScale)

    svg.select('.x-axis').style('transform',`translateY(${dimensions.height}px)`).call(xAxis)
    svg.select('.y-axis').style('transform',`translateX(${dimensions.width}px)`).call(yAxis)

    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal)
    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr('class','line')
      .attr("d", myLine)
      .attr('fill','none')
      .attr('stroke','red');
  }, [data, dimensions]);
  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}>
        <g className="x-axis"/>
        <g className="y-axis"/>
      </svg>
    </div>
  );
}
