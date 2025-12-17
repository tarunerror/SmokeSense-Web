'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface TrendChartProps {
    data: {
        date: Date;
        label: string;
        count: number;
    }[];
}

export default function TrendChart({ data }: TrendChartProps) {
    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        marginBottom: '4px'
                    }}>{label}</p>
                    <p style={{
                        color: 'var(--primary-500)',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>{payload[0].value} cigarettes</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" opacity={0.5} />
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                        dy={10}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="var(--primary-500)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
