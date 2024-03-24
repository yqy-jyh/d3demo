import React, { useRef, useState, useEffect } from "react";
import "../index.css";
import useResizeObserver from "../hooks/useResizeObserver";
import { stackData } from "../mock/StackBar";
import { area, axisBottom, axisLeft, curveCardinal, max, scaleBand, scaleLinear, scalePoint, select,stack} from "d3";

export default function StackArea() {
  const allKeys = ["apple", "banana", "pear"];
  const colors={
    'apple':'green',
    'banana':'orange',
    'pear':'purple'
  }
  const [data, setData] = useState(stackData);
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;
    const xScale = scalePoint()
      .domain(data.map((d) => d.year))
      .range([0, dimensions.width])
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);
    const stackGenerator=stack().keys(allKeys)
    const layers=stackGenerator(data)
    const extent=[0,max(layers,layer=>max(layer,sequence=>sequence[1]))]
    const yScale=scaleLinear().domain(extent).range([dimensions.height,0])
    const yAxis=axisLeft(yScale)
    const areaGenerator=area()
    .x(sequence=>xScale(sequence.data.year))
    .y0(sequence=>yScale(sequence[0]))
    .y1(sequence=>yScale(sequence[1]))
    .curve(curveCardinal)
    svg
      .select(".y-axis")
      .call(yAxis);

    svg.selectAll('.layer')
    .data(layers)
    .join('path')
    .attr('class','layer')
    .attr('fill',layer=>{
        return colors[layer.key]
    })
    .attr('d',areaGenerator)
    
  }, [data, dimensions,allKeys]);
  return (
    <div ref={wrapperRef} style={{ marginBottom: "20px" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}
