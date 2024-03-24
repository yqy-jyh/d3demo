import React, { useRef, useState, useEffect } from "react";
import "../index.css";
import useResizeObserver from "../hooks/useResizeObserver";
import { geoData } from "../mock/custom.geo";
import { geoMercator, geoPath,select,min,max} from "d3";

export default function GeoChart() {
  const [data, setData] = useState(geoData);
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  useEffect(() => {
    const svg = select(svgRef.current);
    const {width,height}=dimensions||wrapperRef.current.getBoundingClientRect()
    const projection=geoMercator().fitSize([width,height],geoData)
    const pathGenerator=geoPath().projection(projection)
    svg.selectAll('.country')
    .data(geoData.features)
    .join('path')
    .attr('class','contry')
    .attr('d',feature=>pathGenerator(feature))
  }, [data, dimensions]);
  return (
    <div ref={wrapperRef} style={{ marginBottom: "20px",height:'90vh'}}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}
