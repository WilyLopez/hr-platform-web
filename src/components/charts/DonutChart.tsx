"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DonutEntry {
  name:  string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data:    DonutEntry[];
  height?: number;
}

export function DonutChart({ data, height = 240 }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="75%"
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            fontSize: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ fontSize: 12, color: "#6b7280" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}