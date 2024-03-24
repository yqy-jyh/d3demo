import React, { useRef, useState, useEffect } from "react";
import "../index.css";
import useResizeObserver from "../hooks/useResizeObserver";
import { treeData } from "../mock/TreeData";
import { hierarchy, linkHorizontal, select, tree } from "d3";

export default function TreeChart() {
  const [data, setData] = useState(treeData);
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg=select(svgRef.current)
    if (!dimensions) return;

    const root=hierarchy(data)
    const treeLayout=tree().size([dimensions.height,dimensions.width])
    treeLayout(root)
    console.log(root.descendants())

    const linkGenerator=linkHorizontal()
    .x(node=>node.y)
    .y(node=>node.x)

    svg.selectAll('.node')
    .data(root.descendants())
    .join('circle')
    .attr('class','node')
    .attr('r',4)
    .attr('fill','black')
    .attr('cx',node=>node.y)
    .attr('cy',node=>node.x)
    svg.selectAll('.link')
    .data(root.links())
    .join('path')
    .attr('class','link')
    .attr('fill','none')
    .attr('stroke','black')
    .attr('d',linkGenerator)
    .attr('stroke-dasharray',function(){
        const length=this.getTotalLength()
        return `${length} ${length}`
    })
    .attr('stroke-dashoffset',function(){
        const length=this.getTotalLength()
        return length
    })
    .transition()
    .duration(500)
    .delay(linkObj=>linkObj.source.depth*500)
    .attr('stroke-dashoffset',0)
    svg.selectAll('.label')
    .data(root.descendants())
    .join('text')
    .attr('class','label')
    .text(node=>node.data.name)
    .attr('text-anchor','middle')
    .attr('font-size',24)
    .attr('x',node=>node.y)
    .attr('y',node=>node.x-10)
  },[data,dimensions])
  return (
    <div ref={wrapperRef} style={{ marginBottom: "20px" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}
