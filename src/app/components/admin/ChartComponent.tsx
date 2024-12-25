'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  date: Date;
  value: number;
}

interface ChartProps {
  data: DataPoint[];
  type: 'line' | 'bar' | 'pie';
  height?: number;
  width?: number;
}

const ChartComponent = ({ data, type, height = 300, width = 600 }: ChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(yScale));

    if (type === 'line') {
      const line = d3.line<DataPoint>()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('d', line);

    } else if (type === 'bar') {
      g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.value))
        .attr('width', innerWidth / data.length * 0.8)
        .attr('height', d => innerHeight - yScale(d.value))
        .attr('fill', '#3b82f6');

    } else if (type === 'pie') {
      const pie = d3.pie<DataPoint>().value(d => d.value);
      const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2);

      const arcs = g.selectAll('arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('transform', `translate(${width/2},${height/2})`);

      arcs.append('path')
        .attr('fill', (_, i) => d3.schemeCategory10[i])
        .attr('d', arc as any);

      arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d as any)})`)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('fill', '#fff')
        .text(d => `${d.data.value}%`);
    }
  }, [data, type, height, width]);

  return (
    <svg 
      ref={svgRef}
      width={width}
      height={height}
      className="w-full h-full"
    />
  );
};

export default ChartComponent;