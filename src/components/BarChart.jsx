import React, { useRef, useState, useEffect } from "react";
import "../index.css";
import useResizeObserver from "../hooks/useResizeObserver";
import { barData } from "../mock/BarData";
import { axisBottom, axisRight, index, max, scaleBand, scaleLinear, select } from "d3";

export default function BarChart() {
  const [data, setData] = useState(barData);
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const colorScale = scaleLinear()
      .domain([75, dimensions.height])
      .range(["green", "red"])
      .clamp(true);

    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, dimensions.width])
      .padding(0.5);
    const xAxis = axisBottom(xScale).ticks(data.length);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);

    const yScale = scaleLinear().domain([0, 150]).range([dimensions.height, 0]);
    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1,-1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -dimensions.height)
      .attr("width", xScale.bandwidth())
      .on('mouseenter',(event,value)=>{
        const index=svg.selectAll('.bar').nodes().indexOf(event.target)
        svg.selectAll('.tooltip')
        .data([value])
        .join((enter)=>enter.append('text').attr("y",yScale(value)-8))
        .attr('class','tooltip')
        .text(value)
        .attr('x',xScale(index)+xScale.bandwidth()/2)
        .attr('text-anchor','middle')
        .transition()
        .attr('y',yScale(value)-8)
        .attr('opacity',1)
      })
      .on('mouseleave',()=>svg.select('.tooltip').remove())
      .transition()
      .attr("fill", colorScale)
      .attr("height", (value) => dimensions.height - yScale(value));
  }, [data, dimensions]);
  return (
    <>
      <div ref={wrapperRef} style={{marginBottom:"20px"}}>
        <svg ref={svgRef}>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
      <button
        onClick={() => {
          setData(data.map((item) => item + 5));
        }}
      >
        update
      </button>
    </>
  );
}
