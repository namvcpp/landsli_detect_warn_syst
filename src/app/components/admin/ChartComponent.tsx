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
  colorScale?: (d: DataPoint) => string;
}

const ChartComponent = ({ data, type, height = 300, width = 600, colorScale }: ChartProps) => {
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

    const color = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([d3.max(data, d => d.value) || 0, 0]); // Inverted to have green for low values and red for high values

    const getTextColor = (backgroundColor: string) => {
      const color = d3.color(backgroundColor);
      if (!color) return '#000';
      const { r, g, b } = color.rgb();
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 125 ? '#000' : '#fff';
    };

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

      // Add X axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

      // Add Y axis
      g.append('g')
        .call(d3.axisLeft(yScale));

    } else if (type === 'bar') {
      g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.value))
        .attr('width', innerWidth / data.length * 0.8)
        .attr('height', d => innerHeight - yScale(d.value))
        .attr('fill', d => color(d.value));

      // Add X axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

      // Add Y axis
      g.append('g')
        .call(d3.axisLeft(yScale));

    } else if (type === 'pie') {
      const threshold = 5; // Threshold percentage for grouping small slices
      const totalValue = d3.sum(data, d => d.value);
      const groupedData = data.reduce((acc, d) => {
        const percentage = (d.value / totalValue) * 100;
        if (percentage < threshold) {
          acc['Others'] = (acc['Others'] || 0) + d.value;
        } else {
          acc[d.value] = (acc[d.value] || 0) + d.value;
        }
        return acc;
      }, {} as Record<string, number>);

      const pieData = Object.entries(groupedData).map(([key, value]) => ({
        value: key === 'Others' ? 'Others' : Number(key),
        count: value
      }));

      // Sort the pieData by value for better coloring
      pieData.sort((a, b) => (a.value === 'Others' ? -1 : b.value === 'Others' ? 1 : a.value - b.value));

      const pie = d3.pie<{ value: number | string, count: number }>().value(d => d.count);
      const arc = d3.arc<d3.PieArcDatum<{ value: number | string, count: number }>>().innerRadius(0).outerRadius(Math.min(width, height) / 2);

      const arcs = g.selectAll('arc')
        .data(pie(pieData))
        .enter()
        .append('g')
        .attr('transform', `translate(${innerWidth / 2},${innerHeight / 2})`);

      arcs.append('path')
        .attr('fill', d => color(typeof d.data.value === 'number' ? d.data.value : 0))
        .attr('d', arc);

      arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', d => getTextColor(color(typeof d.data.value === 'number' ? d.data.value : 0)))
        .text(d => `${d.data.value}`);

      // Add legend
      const legend = svg.append('g')
        .attr('transform', `translate(${innerWidth + margin.right}, ${margin.top})`);

      pieData.forEach((d, i) => {
        const legendRow = legend.append('g')
          .attr('transform', `translate(0, ${i * 20})`);

        legendRow.append('rect')
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', color(typeof d.value === 'number' ? d.value : 0));

        legendRow.append('text')
          .attr('x', 20)
          .attr('y', 10)
          .attr('text-anchor', 'start')
          .style('font-size', '12px')
          .text(`${d.value} (${d.count})`);
      });
    }
  }, [data, type, height, width, colorScale]);

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