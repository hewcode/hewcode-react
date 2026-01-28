import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import useWidgetPolling from './useWidgetPolling';

export default function ChartWidget({
  name,
  path,
  seal,
  label,
  chartType = 'line',
  chartData = [],
  height = 300,
  options = {},
  colors = [],
  refreshInterval,
  className = '',
}) {
  // Use state to hold widget data that can be updated via polling
  const [widgetData, setWidgetData] = useState({
    label,
    chartData,
  });

  // Set up polling if refreshInterval is provided
  useWidgetPolling({
    name,
    path,
    refreshInterval,
    seal,
    onUpdate: (data) => {
      setWidgetData({
        label: data.label ?? widgetData.label,
        chartData: data.chartData ?? widgetData.chartData,
      });
    },
  });

  // Use passed colors or default chart color CSS variables
  const chartColors =
    colors.length > 0 ? colors : ['var(--chart-data-1)', 'var(--chart-data-2)', 'var(--chart-data-3)', 'var(--chart-data-4)', 'var(--chart-data-5)'];

  const renderChart = () => {
    const commonProps = {
      data: widgetData.chartData,
      margin: options.margin || { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={options.xAxisKey || 'name'} className="text-muted-foreground text-xs" stroke="var(--muted-foreground)" />
            <YAxis className="text-muted-foreground text-xs" stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
              labelStyle={{ color: 'var(--popover-foreground)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--foreground)' }} />
            {options.lines?.map((line, index) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke || chartColors[index % chartColors.length]}
                strokeWidth={2}
                dot={false}
                name={line.name}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={options.xAxisKey || 'name'} className="text-muted-foreground text-xs" stroke="var(--muted-foreground)" />
            <YAxis className="text-muted-foreground text-xs" stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
              labelStyle={{ color: 'var(--popover-foreground)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--foreground)' }} />
            {options.bars?.map((bar, index) => (
              <Bar key={bar.dataKey} dataKey={bar.dataKey} fill={bar.fill || chartColors[index % chartColors.length]} name={bar.name} />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={options.xAxisKey || 'name'} className="text-muted-foreground text-xs" stroke="var(--muted-foreground)" />
            <YAxis className="text-muted-foreground text-xs" stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
              labelStyle={{ color: 'var(--popover-foreground)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--foreground)' }} />
            {options.areas?.map((area, index) => (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                stroke={area.stroke || chartColors[index % chartColors.length]}
                fill={area.fill || chartColors[index % chartColors.length]}
                fillOpacity={0.6}
                name={area.name}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={options.label}
              outerRadius={options.outerRadius || 80}
              fill="#8884d8"
              dataKey={options.dataKey || 'value'}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
              labelStyle={{ color: 'var(--popover-foreground)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--foreground)' }} />
          </PieChart>
        );

      default:
        return <div className="text-muted-foreground text-center">Unsupported chart type: {chartType}</div>;
    }
  };

  return (
    <div className={`bg-box border-box-border rounded-lg border shadow-sm ${className}`}>
      {widgetData.label && (
        <div className="border-box-border border-b px-6 py-4">
          <h3 className="text-foreground text-lg font-semibold">{widgetData.label}</h3>
        </div>
      )}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
