import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
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
            dataKey="month" // Use the month property from your trend data
            tick={{ fontSize: 10, fill: "#12153D" }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "#12153D" }}
            padding={{ top: 20, bottom: 20 }}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value"
            fill="#12153D" 
            radius={[5, 5, 5, 5]}
            name="Monthly Trend"
          >
            {/* <LabelList
              dataKey="value"
              position="inside"
              style={{
                fill: "white",
                fontSize: 8,
              }}
              formatter={(value) => formatValue(value)}
            /> */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Bargraph;