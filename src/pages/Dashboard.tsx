import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Car, DollarSign, Users, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";

const statsData = [
  { title: "Total Jobs", value: "248", change: "+12.5%", trend: "up", icon: FileText, color: "text-primary" },
  { title: "Delivered Vehicles", value: "189", change: "+8.2%", trend: "up", icon: Car, color: "text-success" },
  { title: "Pending Payments", value: "₹2.4L", change: "-3.1%", trend: "down", icon: DollarSign, color: "text-warning" },
  { title: "Active Technicians", value: "24", change: "+2", trend: "up", icon: Users, color: "text-info" },
];

const revenueData = [
  { month: "Jan", revenue: 65000, jobs: 45 },
  { month: "Feb", revenue: 78000, jobs: 52 },
  { month: "Mar", revenue: 92000, jobs: 61 },
  { month: "Apr", revenue: 88000, jobs: 58 },
  { month: "May", revenue: 105000, jobs: 68 },
  { month: "Jun", revenue: 125000, jobs: 72 },
];

const recentJobs = [
  { jobNo: "JC-2024-001", vehicle: "MH 01 AB 1234", customer: "Rajesh Kumar", status: "In Progress", date: "2024-01-15", amount: "₹12,500" },
  { jobNo: "JC-2024-002", vehicle: "MH 02 CD 5678", customer: "Priya Sharma", status: "Completed", date: "2024-01-15", amount: "₹8,750" },
  { jobNo: "JC-2024-003", vehicle: "MH 03 EF 9012", customer: "Amit Patel", status: "Pending", date: "2024-01-14", amount: "₹15,200" },
  { jobNo: "JC-2024-004", vehicle: "MH 04 GH 3456", customer: "Sneha Desai", status: "In Progress", date: "2024-01-14", amount: "₹6,800" },
  { jobNo: "JC-2024-005", vehicle: "MH 05 IJ 7890", customer: "Vikram Singh", status: "Completed", date: "2024-01-13", amount: "₹22,400" },
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    "Completed": "default",
    "In Progress": "secondary",
    "Pending": "outline",
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                )}
                <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
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
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Jobs Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
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
                <Bar dataKey="jobs" fill="hsl(var(--primary))" name="Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vehicle No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.jobNo} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{job.jobNo}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{job.vehicle}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{job.customer}</td>
                    <td className="py-3 px-4 text-sm">{getStatusBadge(job.status)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{job.date}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-medium text-right">{job.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
