'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie';
}

const ChartComponent = ({ data, type }: ChartProps) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    // Add your D3.js visualization code here based on the type
    
  }, [data, type]);

  return (
    <svg 
      ref={chartRef}
      className="w-full h-full"
    />
  );
};

export default ChartComponent;