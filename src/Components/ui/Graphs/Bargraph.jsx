import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatValue = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return value;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow">
        <p className="text-sm">{`${label}: ${formatValue(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const Bargraph = ({ data }) => {
  return (
    <div className="mr-13" style={{ width: '111%', height: '100%' }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          barCategoryGap="10%"
        >
          <XAxis
            dataKey="name"
            tick={false}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis 
            tick={false} 
            padding={{ top: 20, bottom: 20 }}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* <Legend formatter={() => 'Monthly Trend'} margin={{left:45}}/> */}
          <Bar 
            dataKey="value"  // Use numeric value for bars
            fill="#12153D" 
            radius={[5, 5, 5, 5]}
            name="Monthly Trend"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Bargraph;