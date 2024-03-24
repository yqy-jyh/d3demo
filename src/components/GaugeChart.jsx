import React, { useRef, useState, useEffect } from "react";
import "../index.css";
import useResizeObserver from "../hooks/useResizeObserver";
import { gaugeData } from "../mock/GaugeData";
import { select,arc,pie, scaleLinear, interpolate} from "d3";

export default function GaugeChart() {
  const [data, setData] = useState(gaugeData);
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(()=>{
    const svg=select(svgRef.current)
    if (!dimensions) return;

    const arcGenerator=arc().innerRadius(75).outerRadius(150)

    const pieGenerator=pie().startAngle(-0.5*Math.PI).endAngle(0.5*Math.PI).sort(null)

    const instructions=pieGenerator(data)

    svg.selectAll('.slice')
    .data(instructions)
    .join('path')
    .attr('class','slice')
    .attr('fill',(instruction,index)=>index===0?'#ffcc00':'#eee')
    .style('transform',`translate(${dimensions.width/2}px,${dimensions.height/2}px)`)
    .transition()
    .attrTween('d',function(nextInstruction){
        const interpolator=interpolate(this.lastInstruction,nextInstruction)
        this.lastInstruction=interpolator(1)
        return function(t){
            return arcGenerator(interpolator(t))
        }
    })
  },[data,dimensions])

  return (
    <div ref={wrapperRef} style={{ marginBottom: "20px" }}>
      <svg ref={svgRef}>
      </svg>
    </div>
  );
}
