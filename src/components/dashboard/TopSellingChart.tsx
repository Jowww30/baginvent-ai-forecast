import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "NFA Rice 5kg", sales: 145, color: "hsl(var(--primary))" },
  { name: "Lucky Me Pancit Canton", sales: 128, color: "hsl(var(--accent))" },
  { name: "Argentina Corned Beef", sales: 96, color: "hsl(var(--success))" },
  { name: "Bear Brand Milk", sales: 84, color: "hsl(var(--warning))" },
  { name: "Coca-Cola 1.5L", sales: 72, color: "hsl(var(--chart-5))" },
];

export function TopSellingChart() {
  return (
    <div className="chart-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top Selling Products</h3>
          <p className="text-sm text-muted-foreground">This week's best performers</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              width={150}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value) => [`${value} units`, 'Sales']}
            />
            <Bar dataKey="sales" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
