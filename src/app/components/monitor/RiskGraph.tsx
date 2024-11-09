import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface SensorData {
  timestamp: string;
  risk: number;
  sensorId: number; // Add this
}

interface RiskGraphProps {
  data: SensorData[];
}

const RiskGraph: React.FC<RiskGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 400
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!data.length || !dimensions.width) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 100, bottom: 30, left: 50 }; // Increased right margin
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Group data by sensorId
    const sensorGroups = d3.group(data, d => d.sensorId);
    
    // Generate colors for each sensor
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100]) // Fixed scale for risk (0-100)
      .range([height, 0]);

    const line = d3.line<SensorData>()
      .x(d => x(new Date(d.timestamp)))
      .y(d => y(d.risk))
      .curve(d3.curveMonotoneX); // Add curve interpolation

    const g = svg.append('g')
      .attr('class', 'graph')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add axes
    g.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(6)
        .tickFormat(d => d3.timeFormat('%H:%M')(d as Date)));

    g.append('g')
      .attr('class', 'axis y-axis')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => `${d}%`));

    // Add axis labels
    g.append('text')
      .attr('class', 'axis-label')
      .attr('x', -height/2)
      .attr('y', -30)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle')
      .text('Risk Level (%)');

    g.append('text')
      .attr('class', 'axis-label')
      .attr('x', width/2)
      .attr('y', height + 25)
      .style('text-anchor', 'middle')
      .text('Time');

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat(() => ''))
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2);

    // Draw multiple lines
    sensorGroups.forEach((sensorData, sensorId) => {
      // Draw line
      const path = g.append('path')
        .datum(sensorData)
        .attr('class', `line sensor-${sensorId}`)
        .attr('fill', 'none')
        .attr('stroke', colorScale(sensorId.toString()))
        .attr('stroke-width', 2)
        .attr('d', line);

      // Animate line
      const pathLength = path.node()?.getTotalLength() || 0;
      path
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(1000)
        .attr('stroke-dashoffset', 0);

      // Add dots
      g.selectAll(`.dot-sensor-${sensorId}`)
        .data(sensorData)
        .enter()
        .append('circle')
        .attr('class', `dot dot-sensor-${sensorId}`)
        .attr('cx', d => x(new Date(d.timestamp)))
        .attr('cy', d => y(d.risk))
        .attr('r', 4)
        .attr('fill', colorScale(sensorId.toString()))
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
    });

    // Add legend
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width + 20}, 10)`); // Adjusted position

    Array.from(sensorGroups.keys()).forEach((sensorId, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`); // Increased vertical spacing

      legendItem.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', colorScale(sensorId.toString()));

      legendItem.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('alignment-baseline', 'middle')
        .style('font-size', '12px')
        .text(`Sensor ${sensorId}`);
    });

    // Add hover effects
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.7)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Add hover effects for all dots
    g.selectAll('.dot')
      .on('mouseover', (event, d) => {
        const sensorData = d as SensorData;
        const target = event.target as SVGCircleElement;
        d3.select(target)
          .attr('r', 6)
          .attr('stroke-width', 3);
        
        tooltip
          .html(`Sensor ${sensorData.sensorId}<br/>Time: ${d3.timeFormat('%H:%M')(new Date(sensorData.timestamp))}<br/>Risk: ${sensorData.risk.toFixed(1)}%`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .style('opacity', 1);
      })
      .on('mouseout', (event) => {
        const target = event.target as SVGCircleElement;
        d3.select(target)
          .attr('r', 4)
          .attr('stroke-width', 2);
        tooltip.style('opacity', 0);
      });

  }, [data, dimensions.width]);

  return (
    <div ref={containerRef} className="w-full">
      <svg 
        ref={svgRef} 
        width={dimensions.width} 
        height={dimensions.height}
        style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
};

export default RiskGraph;