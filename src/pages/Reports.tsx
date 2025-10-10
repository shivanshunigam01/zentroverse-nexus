import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const incomeData = [
  { month: "Jan", jobCards: 65000, counterSales: 35000 },
  { month: "Feb", jobCards: 78000, counterSales: 42000 },
  { month: "Mar", jobCards: 92000, counterSales: 38000 },
  { month: "Apr", jobCards: 88000, counterSales: 45000 },
  { month: "May", jobCards: 105000, counterSales: 52000 },
  { month: "Jun", jobCards: 125000, counterSales: 48000 },
];

const expenseData = [
  { category: "Purchases", amount: 45000 },
  { category: "Salaries", amount: 85000 },
  { category: "Rent", amount: 35000 },
  { category: "Utilities", amount: 15000 },
  { category: "Others", amount: 20000 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))'];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive business insights</p>
        </div>
      </div>

      <Tabs defaultValue="income">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Income Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="jobCards" fill="hsl(var(--primary))" name="Job Cards" />
                  <Bar dataKey="counterSales" fill="hsl(var(--accent))" name="Counter Sales" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="hsl(var(--primary))"
                      dataKey="amount"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Expense Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenseData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded" style={{ backgroundColor: COLORS[idx] }}></div>
                        <span className="text-sm font-medium text-foreground">{item.category}</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Inventory reports and analytics</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Operational reports and metrics</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
